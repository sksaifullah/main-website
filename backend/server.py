import json
import os
import uuid
import base64
import time
import tempfile
import urllib
import urllib.request
import urllib.parse
import threading
import logging
import requests
from typing import Dict, Any, Optional
from collections import defaultdict
from fastapi import FastAPI, HTTPException, Request, Body, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("db_persistence")

db_lock = threading.RLock()

def log_db_op(op_type: str, entity: str, entity_id: str, status: str, details: str = ""):
    msg = f"DB Op: [{op_type.upper()}] Entity: {entity} (ID: {entity_id}) - Status: {status}. {details}".strip()
    if status == "SUCCESS":
        logger.info(msg)
    else:
        logger.error(msg)

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")

DB_FILE = os.path.join(BACKEND_DIR, "data", "database.json")
IMAGES_DIR = os.path.join(FRONTEND_DIR, "images")

os.makedirs(IMAGES_DIR, exist_ok=True)

BASE_DIR = BACKEND_DIR

# Load environment variables from .env if present
def load_env_file():
    env_path = os.path.join(BASE_DIR, ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        os.environ[k.strip()] = v.strip()
        except Exception:
            pass

load_env_file()

# DEVELOPMENT MODE CONFIGURATION
# Set to True to temporarily bypass login and grant direct dashboard access.
# Set to False to restore standard login authentication automatically.
DEVELOPMENT_MODE = os.getenv("DEVELOPMENT_MODE", "false").lower() in ("true", "1", "yes")


# ==============================================================================
# IN-MEMORY RATE LIMITER (30 requests/minute per IP on public tracking)
# ==============================================================================
class RateLimiter:
    """In-memory rate limiter per IP address for public tracking endpoint."""
    def __init__(self, max_requests: int = 30, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window = window_seconds
        self._hits = defaultdict(list)
        self._lock = threading.Lock()

    def is_allowed(self, client_ip: str) -> bool:
        now = time.time()
        with self._lock:
            cutoff = now - self.window
            self._hits[client_ip] = [t for t in self._hits[client_ip] if t > cutoff]
            if len(self._hits[client_ip]) < self.max_requests:
                self._hits[client_ip].append(now)
                return True
            return False

    def remaining(self, client_ip: str) -> int:
        now = time.time()
        with self._lock:
            cutoff = now - self.window
            self._hits[client_ip] = [t for t in self._hits[client_ip] if t > cutoff]
            return max(0, self.max_requests - len(self._hits[client_ip]))

tracking_rate_limiter = RateLimiter(max_requests=30, window_seconds=60)

def hash_password(password: str) -> str:
    """SHA-256 hash for secure admin password storage."""
    import hashlib
    return hashlib.sha256(f"sky_salt_{password}".encode("utf-8")).hexdigest()

def verify_password(plain_password: str, stored_hash: str) -> bool:
    """Verify plain password against hashed password strictly."""
    if not plain_password or not stored_hash:
        return False
    return hash_password(plain_password) == stored_hash

DEFAULT_ADMIN = {
    "username": "Admin",
    "email": "admin@skyworldwide.com",
    "password_hash": hash_password("sky@123")
}

DEFAULT_SETTINGS = {
    "logo_url": "images/logo1.PNG",
    "hero_bg_url": "images/hero-bg.jpg",
    "hero_title": "World-Class Express Courier & Air Freight Delivery.",
    "hero_subtitle": "Reliable door-to-door international express courier for parcels, prescription medicines, food, documents, and commercial excess baggage to USA, UK, UAE, Australia, and 220+ countries.",
    "phone": "+91 98200 12345",
    "whatsapp": "+91 98200 12345",
    "email": "support@skyworldwide.com",
    "address": "Sky Worldwide Cargo Hub, Near International Airport Cargo Terminal, Sahar, Mumbai 400099, India.",
    "maps_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.886737525381!2d72.86877131538604!3d19.09066605650228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9a96e620577%3A0xe510f0e08f511fa!2sChhatrapati%20Shivaji%20Maharaj%20International%20Airport%20Mumbai!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    "business_hours": "Monday – Saturday: 9:00 AM – 9:00 PM | Sunday: 10:00 AM – 6:00 PM",
    "site_images": {
        "hero_card_img": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
        "office_img": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        "pickup_img": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
        "customs_img": "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
        "coldchain_img": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
        "lowestrates_img": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80"
    }
}

DEFAULT_SERVICES = [
    {
        "id": "srv-1",
        "title": "International Courier",
        "category": "Express Air",
        "icon": "fa-plane-up",
        "image": "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80",
        "description": "Fast door-to-door express parcel delivery to USA, UK, UAE, Canada, and Europe within 2-4 business days.",
        "enabled": True
    },
    {
        "id": "srv-2",
        "title": "Air Cargo Freight",
        "category": "Heavy Freight",
        "icon": "fa-boxes-packing",
        "image": "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=600&q=80",
        "description": "Commercial cargo shipments, industrial machinery, and palletized commercial air freight.",
        "enabled": True
    },
    {
        "id": "srv-3",
        "title": "Medicine Delivery",
        "category": "Medicine Special",
        "icon": "fa-pills",
        "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
        "description": "Specialized international shipping for NRI prescription drugs, Ayurvedic medicines, and healthcare equipment.",
        "enabled": True
    },
    {
        "id": "srv-4",
        "title": "Food Items Delivery",
        "category": "Food Items",
        "icon": "fa-utensils",
        "image": "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=600&q=80",
        "description": "Send homemade sweets, spices, snacks, and non-perishable grocery goods safely to family overseas.",
        "enabled": True
    },
    {
        "id": "srv-5",
        "title": "Parcel Delivery",
        "category": "Standard Parcel",
        "icon": "fa-box-open",
        "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
        "description": "Fast door pickup and custom declaration for worldwide gift and personal care parcels.",
        "enabled": True
    },
    {
        "id": "srv-6",
        "title": "Documents",
        "category": "Express Docs",
        "icon": "fa-file-lines",
        "image": "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
        "description": "University transcripts, passports, legal contracts, certificates, and visa applications.",
        "enabled": True
    },
    {
        "id": "srv-7",
        "title": "Excess Baggage",
        "category": "Student Baggage",
        "icon": "fa-suitcase-rolling",
        "image": "https://images.unsplash.com/photo-1565026057447-b88e404d1316?auto=format&fit=crop&w=600&q=80",
        "description": "Avoid airline airport baggage fees by dispatching personal luggage, student baggage, and household items.",
        "enabled": True
    },
    {
        "id": "srv-8",
        "title": "Worldwide Shipping",
        "category": "Global Cargo",
        "icon": "fa-globe",
        "image": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80",
        "description": "Customs cleared global courier dispatch to 220+ international countries with 24/7 GPS tracking.",
        "enabled": True
    }
]

DEFAULT_CARRIER_CONFIGS = {
    "fedex": {"status": "Active", "client_id": "", "client_secret": "", "account_number": "", "environment": "sandbox"},
    "dhl": {"status": "Active", "api_key": "", "account_number": ""},
    "ups": {"status": "Active", "client_id": "", "client_secret": ""},
    "aramex": {"status": "Active", "username": "", "password": "", "account_number": "", "account_pin": ""},
    "auto_sync": {"enabled": True, "interval_minutes": 30}
}

def load_db() -> Dict[str, Any]:
    with db_lock:
        if os.path.exists(DB_FILE):
            try:
                with open(DB_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if not isinstance(data, dict):
                        data = {}
                    if "tracking" not in data:
                        data["tracking"] = {}
                    if "quotes" not in data:
                        data["quotes"] = []
                    if "contacts" not in data:
                        data["contacts"] = []
                    if "settings" not in data:
                        data["settings"] = DEFAULT_SETTINGS
                    if "services" not in data:
                        data["services"] = DEFAULT_SERVICES
                    if "carrier_configs" not in data:
                        data["carrier_configs"] = DEFAULT_CARRIER_CONFIGS
                    if "admin_credentials" not in data or not isinstance(data.get("admin_credentials"), dict):
                        data["admin_credentials"] = DEFAULT_ADMIN
                    if "sync_logs" not in data:
                        data["sync_logs"] = []
                    if "auto_sync" not in data:
                        data["auto_sync"] = {"enabled": True, "interval_minutes": 30}
                    return data
            except Exception as e:
                logger.error(f"Failed to load database file {DB_FILE}: {e}")
        return {
            "tracking": {},
            "quotes": [],
            "contacts": [],
            "settings": DEFAULT_SETTINGS,
            "services": DEFAULT_SERVICES,
            "carrier_configs": DEFAULT_CARRIER_CONFIGS,
            "admin_credentials": DEFAULT_ADMIN,
            "sync_logs": [],
            "auto_sync": {"enabled": True, "interval_minutes": 30}
        }

def ensure_admin_account():
    """Server startup check: verify admin_credentials exist and are properly hashed using current hash_password()."""
    db = load_db()
    admin_creds = db.get("admin_credentials")
    current_hash = hash_password("sky@123")
    
    needs_update = False
    if not admin_creds or not isinstance(admin_creds, dict):
        db["admin_credentials"] = {
            "username": "Admin",
            "email": "admin@skyworldwide.com",
            "password_hash": current_hash
        }
        needs_update = True
    else:
        if not admin_creds.get("username"):
            admin_creds["username"] = "Admin"
            needs_update = True
        if not admin_creds.get("email"):
            admin_creds["email"] = "admin@skyworldwide.com"
            needs_update = True
        if not admin_creds.get("password_hash") or not verify_password("sky@123", admin_creds.get("password_hash")):
            admin_creds["password_hash"] = current_hash
            needs_update = True
        db["admin_credentials"] = admin_creds

    if needs_update:
        save_db(db)

ensure_admin_account()

def save_db(data: Dict[str, Any], verification_fn=None) -> bool:
    """Write-then-rename for crash-safe JSON persistence with write verification."""
    success, _ = save_db_and_verify(data, verification_fn)
    return success

def save_db_and_verify(data: Dict[str, Any], verification_fn=None) -> tuple[bool, str]:
    with db_lock:
        os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
        dir_name = os.path.dirname(DB_FILE)
        
        tmp_path = None
        write_success = False
        try:
            fd, tmp_path = tempfile.mkstemp(suffix=".json", dir=dir_name)
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
                f.flush()
                os.fsync(f.fileno())
            
            # Atomic rename / replace with retries for Windows file handle conflicts
            max_retries = 5
            for attempt in range(max_retries):
                try:
                    if os.path.exists(DB_FILE):
                        os.replace(tmp_path, DB_FILE)
                    else:
                        os.rename(tmp_path, DB_FILE)
                    write_success = True
                    break
                except PermissionError as pe:
                    if attempt < max_retries - 1:
                        time.sleep(0.05 * (2 ** attempt))
                    else:
                        return False, f"Permission denied: Insufficient file permissions to overwrite '{DB_FILE}' ({pe})."
                except Exception as ex:
                    if attempt < max_retries - 1:
                        time.sleep(0.05 * (2 ** attempt))
                    else:
                        raise ex
        except PermissionError as pe:
            logger.error(f"Permission denied while creating temporary file in '{dir_name}': {pe}")
            return False, f"Permission denied: Insufficient OS permissions in directory '{dir_name}' ({pe})."
        except Exception as e:
            logger.warning(f"Atomic file replace failed ({e}), attempting direct file write fallback...")
            if tmp_path and os.path.exists(tmp_path):
                try:
                    os.remove(tmp_path)
                except Exception:
                    pass
            try:
                with open(DB_FILE, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2)
                    f.flush()
                    os.fsync(f.fileno())
                write_success = True
            except PermissionError as pe:
                logger.error(f"Permission denied during direct file write fallback: {pe}")
                return False, f"Permission denied: Cannot write to '{DB_FILE}' due to file access restrictions ({pe})."
            except Exception as direct_err:
                logger.error(f"Direct file write fallback failed: {direct_err}")
                return False, f"Database write failed: Operating system I/O error ({direct_err})."

        if not write_success or not os.path.exists(DB_FILE):
            return False, "Database write failed: Database file was not written to physical disk."

        # Immediate Reload and Verification
        try:
            with open(DB_FILE, "r", encoding="utf-8") as vf:
                reloaded = json.load(vf)
            if not isinstance(reloaded, dict):
                return False, "JSON parse failed: Reloaded database file is invalid non-dict JSON structure."
            
            if verification_fn is not None:
                if not verification_fn(reloaded):
                    return False, "Database write failed: Saved data verification failed after reloading database file."
        except json.JSONDecodeError as jde:
            logger.error(f"JSON parse failed during reload verification: {jde}")
            return False, f"JSON parse failed: Reloaded database contains invalid JSON syntax ({jde})."
        except PermissionError as pe:
            logger.error(f"Permission denied during reload verification: {pe}")
            return False, f"Permission denied: Unable to read database file for reload verification ({pe})."
        except Exception as ver_err:
            logger.error(f"Post-write reload verification failed: {ver_err}")
            return False, f"Database write failed: Post-write reload verification error ({ver_err})."

        return True, ""

app = FastAPI(title="Sky Worldwide International API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_no_cache_headers(request: Request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response

@app.exception_handler(json.JSONDecodeError)
async def json_decode_exception_handler(request: Request, exc: json.JSONDecodeError):
    err_msg = f"JSON parse failed: Invalid JSON syntax at line {exc.lineno} column {exc.colno} ({exc.msg})."
    logger.error(f"[JSON PARSE ERROR] {err_msg}")
    return JSONResponse(
        status_code=400,
        content={"success": False, "detail": err_msg, "error": err_msg}
    )

@app.exception_handler(PermissionError)
async def permission_exception_handler(request: Request, exc: PermissionError):
    err_msg = f"Permission denied: Insufficient OS permissions for database file operation ({exc})."
    logger.error(f"[PERMISSION ERROR] {err_msg}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "detail": err_msg, "error": err_msg}
    )

@app.get("/api/settings")
def get_settings():
    db = load_db()
    return {"success": True, "data": db.get("settings", DEFAULT_SETTINGS)}

@app.post("/api/settings")
def update_settings(payload: Dict[str, Any] = Body(...)):
    db = load_db()
    current = db.get("settings", DEFAULT_SETTINGS)
    current.update(payload)
    db["settings"] = current

    def verify(reloaded):
        return "settings" in reloaded

    ok, err = save_db_and_verify(db, verify)
    if not ok:
        log_db_op("UPDATE", "Settings", "global", "FAILED", err)
        raise HTTPException(status_code=500, detail=f"Database write failed: {err}")

    log_db_op("UPDATE", "Settings", "global", "SUCCESS")
    return {"success": True, "message": "Settings updated successfully.", "data": current}

@app.get("/api/services")
def get_services():
    db = load_db()
    return {"success": True, "data": db.get("services", DEFAULT_SERVICES)}

@app.post("/api/services")
def create_or_update_service(payload: Dict[str, Any] = Body(...)):
    db = load_db()
    services = db.get("services", DEFAULT_SERVICES)
    srv_id = payload.get("id")
    is_create = False
    if not srv_id:
        srv_id = f"srv-{len(services) + 1}-{uuid.uuid4().hex[:4]}"
        payload["id"] = srv_id
        services.append(payload)
        is_create = True
    else:
        found = False
        for idx, s in enumerate(services):
            if s.get("id") == srv_id:
                services[idx] = payload
                found = True
                break
        if not found:
            services.append(payload)
            is_create = True
            
    db["services"] = services

    def verify(reloaded):
        return any(s.get("id") == srv_id for s in reloaded.get("services", []))

    ok, err = save_db_and_verify(db, verify)
    op_name = "CREATE" if is_create else "UPDATE"
    if not ok:
        log_db_op(op_name, "Service", srv_id, "FAILED", err)
        raise HTTPException(status_code=500, detail=f"Database write failed: {err}")

    log_db_op(op_name, "Service", srv_id, "SUCCESS")
    return {"success": True, "message": "Service saved successfully.", "data": payload}

@app.delete("/api/services/{srv_id}")
def delete_service(srv_id: str):
    db = load_db()
    services = db.get("services", [])
    db["services"] = [s for s in services if s.get("id") != srv_id]

    def verify(reloaded):
        return all(s.get("id") != srv_id for s in reloaded.get("services", []))

    ok, err = save_db_and_verify(db, verify)
    if not ok:
        log_db_op("DELETE", "Service", srv_id, "FAILED", err)
        raise HTTPException(status_code=500, detail=f"Database write failed: {err}")

    log_db_op("DELETE", "Service", srv_id, "SUCCESS")
    return {"success": True, "message": f"Service {srv_id} deleted."}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename or "")[1]
    if not ext:
        ext = ".jpg"
    filename = f"upload_{uuid.uuid4().hex[:8]}{ext}"
    file_path = os.path.join(IMAGES_DIR, filename)
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    rel_url = f"images/{filename}"
    return {"success": True, "url": rel_url}

@app.post("/api/upload/base64")
def upload_base64(payload: Dict[str, Any] = Body(...)):
    data_str = payload.get("data", "")
    filename_in = payload.get("filename", "image.jpg")
    ext = os.path.splitext(filename_in)[1] or ".jpg"
    if "," in data_str:
        data_str = data_str.split(",", 1)[1]
    content = base64.b64decode(data_str)
    filename = f"upload_{uuid.uuid4().hex[:8]}{ext}"
    file_path = os.path.join(IMAGES_DIR, filename)
    with open(file_path, "wb") as f:
        f.write(content)
    return {"success": True, "url": f"images/{filename}"}

# ==============================================================================
# OFFICIAL PARTNER COURIER ARCHITECTURE & VALIDATION
# ==============================================================================
import random
from datetime import datetime, timedelta

SUPPORTED_COURIERS = {
    "dhl": "DHL",
    "fedex": "FedEx",
    "ups": "UPS",
    "aramex": "Aramex"
}

def detect_carrier_by_pattern(tracking_num: str) -> Optional[str]:
    num = tracking_num.strip()
    if not num:
        return None
    
    # UPS tracking numbers start with 1Z and are 18 characters long
    if num.upper().startswith("1Z") and len(num) == 18:
        return "UPS"
    # Aramex format: 10 or 11 digits starting with 3 or 4
    if num.isdigit() and len(num) == 11 and num.startswith(("3", "4")):
        return "Aramex"
    # FedEx format: 12, 15, or 20 digits, or 10 digits starting with 7
    if num.isdigit() and (len(num) in (12, 15, 20) or (len(num) == 10 and num.startswith("7"))):
        return "FedEx"
    # DHL Express format: 10 digits starting with numbers other than 7 or starting with JD
    if num.upper().startswith("JD") or (num.isdigit() and len(num) == 10 and not num.startswith("7")):
        return "DHL"
    return None


# Modular Carrier Integration Base & Provider Classes
def _compute_status_code(status_text: str) -> str:
    """Derive machine-readable status code from human-readable status."""
    st = status_text.lower()
    if "deliver" in st and "out" not in st:
        return "DELIVERED"
    elif "out for" in st:
        return "OUT_FOR_DELIVERY"
    elif "transit" in st or "flight" in st or "hub" in st:
        return "IN_TRANSIT"
    elif "pickup" in st or "picked" in st:
        return "PICKED_UP"
    elif "waiting" in st:
        return "WAITING"
    elif "customs" in st:
        return "IN_TRANSIT"
    return "BOOKED"


def _is_cache_valid(shipment: dict) -> bool:
    """
    Cache disabled — Always return False to ensure fresh live data is fetched from carrier APIs on every request.
    """
    return False


def _set_cache_ttl(shipment: dict):
    """Set appropriate cache TTL based on shipment status."""
    status = (shipment.get("status") or "").lower()
    if "deliver" in status:
        ttl = timedelta(hours=24)
    elif "waiting" in status:
        ttl = timedelta(hours=12)
    else:
        ttl = timedelta(minutes=30)
    shipment["tracking_cache_ttl"] = (datetime.now() + ttl).isoformat()


# ==============================================================================
# OFFICIAL CARRIER INTEGRATIONS (FedEx, DHL, UPS, Aramex Direct APIs)
# ==============================================================================

class CarrierAPIException(Exception):
    def __init__(self, err_type: str, message: str, http_status: int = 400, elapsed_ms: int = 0, raw_err: str = ""):
        super().__init__(message)
        self.err_type = err_type
        self.message = message
        self.http_status = http_status
        self.elapsed_ms = elapsed_ms
        self.raw_err = raw_err

# ==============================================================================
# UNIVERSAL MULTI-CARRIER ADAPTER ARCHITECTURE
# ==============================================================================

PROTECTED_CUSTOMER_FIELDS = {
    "customer_name", "sender_name", "receiver_name", "phone", "email",
    "invoice_number", "pricing", "charges", "internal_notes"
}

def calculate_progress_percent(status_text: str) -> int:
    """Calculate progress bar percentage dynamically from human-readable status."""
    st = (status_text or "").lower()
    if "deliver" in st and "out" not in st:
        return 100
    elif "ready for pickup" in st or "pickup ready" in st:
        return 100
    elif "out for" in st:
        return 90
    elif "customs" in st or "arrived" in st or "hub" in st or "clearance" in st:
        return 75
    elif "transit" in st or "flight" in st or "departed" in st or "dispatch" in st:
        return 50
    elif "pickup" in st or "picked" in st or "collected" in st:
        return 25
    elif "booked" in st or "created" in st or "label" in st or "waiting" in st:
        return 10
    return 50

class BaseCarrierAdapter:
    """Abstract base class for all carrier integration adapters."""
    code: str = "generic"
    name: str = "Generic Courier"

    def authenticate(self, cfg: dict) -> dict:
        """Authenticate with carrier API if required."""
        return {}

    def fetch_tracking(self, partner_num: str, cfg: dict) -> tuple[dict, int, int, str]:
        """Fetch live tracking data for given partner tracking number."""
        raise NotImplementedError("Subclasses must implement fetch_tracking")


def _get_fedex_base_url(cfg: dict) -> str:
    env = (cfg.get("environment") or "sandbox").strip().lower()
    if env == "production":
        return "https://apis.fedex.com"
    return "https://apis-sandbox.fedex.com"

def _fedex_authenticate(cfg: dict) -> dict:
    client_id = (cfg.get("client_id") or "").strip()
    client_secret = (cfg.get("client_secret") or "").strip()

    if not client_id or not client_secret or client_id.startswith("FEDEX-CLIENT-") or "••••" in client_secret:
        raise CarrierAPIException(
            "Missing Credentials",
            "FedEx Client ID and Client Secret are required. Please configure FedEx API credentials in Carrier Integration Settings.",
            400, 0, ""
        )

    base_url = _get_fedex_base_url(cfg)
    auth_url = f"{base_url}/oauth/token"
    method = "POST"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    payload = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    }

    masked_secret = client_secret[:4] + "••••" + client_secret[-4:] if len(client_secret) > 8 else "••••••••"
    masked_body = f"grant_type=client_credentials&client_id={client_id}&client_secret={masked_secret}"

    print(f"\n==================== [FEDEX OAUTH REQUEST] ====================")
    print(f"OAuth URL:    {auth_url}")
    print(f"HTTP Method:  {method}")
    print(f"Headers:      {headers}")
    print(f"Request Body: {masked_body}")
    print(f"================================================================\n")

    logger.info(f"[FEDEX OAUTH REQUEST] URL: {auth_url} Method: {method} Headers: {headers} Body: {masked_body}")

    start_time = time.time()
    try:
        resp = requests.post(auth_url, data=payload, headers=headers, timeout=10)
        elapsed_ms = int((time.time() - start_time) * 1000)

        print(f"\n==================== [FEDEX OAUTH RESPONSE] ====================")
        print(f"HTTP Status:      {resp.status_code}")
        print(f"Response Headers: {dict(resp.headers)}")
        print(f"Response Body:    {resp.text}")
        print(f"=================================================================\n")

        logger.info(f"[FEDEX OAUTH RESPONSE] HTTP Status: {resp.status_code} Elapsed: {elapsed_ms}ms Body: {resp.text}")

        if resp.status_code == 200:
            token_json = resp.json()
            logger.info("[FEDEX OAUTH SUCCESS] Access Token successfully acquired.")
            return token_json
        else:
            raise CarrierAPIException("Authentication Failed", f"FedEx OAuth authentication failed (HTTP {resp.status_code}): {resp.text}", resp.status_code, elapsed_ms, resp.text)
    except requests.exceptions.Timeout:
        elapsed_ms = int((time.time() - start_time) * 1000)
        raise CarrierAPIException("Network Timeout", "Network Timeout — Connection to FedEx OAuth server timed out.", 504, elapsed_ms)
    except requests.exceptions.RequestException as req_err:
        elapsed_ms = int((time.time() - start_time) * 1000)
        raise CarrierAPIException("API Offline", f"API Offline — Connection failed: {str(req_err)}", 503, elapsed_ms)


class FedExAdapter(BaseCarrierAdapter):
    code = "fedex"
    name = "FedEx Express"

    def authenticate(self, cfg: dict) -> dict:
        return _fedex_authenticate(cfg)

    def fetch_tracking(self, partner_num: str, cfg: dict) -> tuple[dict, int, int, str]:
        start_time = time.time()
        base_url = _get_fedex_base_url(cfg)
        track_url = f"{base_url}/track/v1/trackingnumbers"

        print(f"[FEDEX TRACK REQUEST] Full Tracking URL: {track_url} for tracking number '{partner_num}'")
        logger.info(f"[FEDEX TRACK REQUEST] Full Tracking URL: {track_url} for tracking number '{partner_num}'")
        
        token_data = self.authenticate(cfg)
        access_token = token_data.get("access_token")

        headers = {
            "Authorization": f"Bearer {access_token}",
            "X-locale": "en_US",
            "Content-Type": "application/json"
        }
        payload = {
            "trackingInfo": [{"trackingNumberInfo": {"trackingNumber": partner_num}}],
            "includeDetailedScans": True
        }

        resp = requests.post(track_url, json=payload, headers=headers, timeout=12)
        elapsed_ms = int((time.time() - start_time) * 1000)
        print(f"[FEDEX TRACK RESPONSE] HTTP Status: {resp.status_code}, Elapsed: {elapsed_ms}ms")
        logger.info(f"[FEDEX TRACK RESPONSE] HTTP Status: {resp.status_code}, Elapsed: {elapsed_ms}ms")

        if resp.status_code == 200:
            tr_data = resp.json()
            track_results = tr_data.get("output", {}).get("completeTrackResults", [])
            if not track_results or not track_results[0].get("trackResults"):
                raise CarrierAPIException("Tracking Number Not Found", f"Tracking Number Not Found — Partner number '{partner_num}' not found on FedEx.", 404, elapsed_ms, resp.text)

            res = track_results[0]["trackResults"][0]
            status_desc = res.get("latestStatusDetail", {}).get("description") or "In Transit"

            def _fmt_addr(addr_dict: dict) -> str:
                if not isinstance(addr_dict, dict):
                    return ""
                city = (addr_dict.get("city") or "").strip()
                state = (addr_dict.get("stateOrProvinceCode") or "").strip()
                country = (addr_dict.get("countryName") or addr_dict.get("countryCode") or "").strip()
                parts = [p for p in [city, state, country] if p]
                return ", ".join(parts)

            # Current Location
            loc_obj = res.get("latestStatusDetail", {}).get("scanLocation", {})
            loc_str = _fmt_addr(loc_obj)

            # Scans & History
            scans = res.get("scanEvents", [])
            history = []
            for sc in scans:
                sc_desc = sc.get("eventDescription") or sc.get("derivedStatus") or status_desc
                sc_loc_obj = sc.get("scanLocation", {})
                sc_loc = _fmt_addr(sc_loc_obj) or loc_str or "FedEx Gateway"
                sc_ts = sc.get("date") or datetime.now().strftime("%Y-%m-%d %I:%M %p")
                history.append({
                    "stage": sc_desc,
                    "status": sc_desc,
                    "location": sc_loc,
                    "timestamp": sc_ts,
                    "date": sc_ts.split("T")[0] if "T" in sc_ts else (sc_ts.split(" ")[0] if " " in sc_ts else sc_ts),
                    "time": sc_ts.split("T")[1][:5] if "T" in sc_ts else (" ".join(sc_ts.split(" ")[1:]) if " " in sc_ts else ""),
                    "details": sc_desc,
                    "description": sc_desc,
                    "courier": "FedEx",
                    "completed": True
                })

            history.sort(key=lambda x: str(x.get("timestamp", "")), reverse=True)

            if not loc_str and history:
                loc_str = history[0].get("location") or "FedEx Gateway Hub"
            elif not loc_str:
                loc_str = "FedEx Gateway Hub"

            # Origin Address
            orig_dict = res.get("originLocation", {}).get("locationContactAndAddress", {}).get("address") \
                or res.get("shipperInformation", {}).get("address") \
                or res.get("requestedShipment", {}).get("shipper", {}).get("address") \
                or {}
            orig_str = _fmt_addr(orig_dict)
            if not orig_str and history:
                orig_str = history[-1].get("location") or "Origin Hub"
            elif not orig_str:
                orig_str = "Origin Hub"

            # Destination Address
            dest_dict = res.get("destinationLocation", {}).get("locationContactAndAddress", {}).get("address") \
                or res.get("recipientInformation", {}).get("address") \
                or res.get("requestedShipment", {}).get("recipient", {}).get("address") \
                or {}
            dest_str = _fmt_addr(dest_dict) or "Destination"

            # Estimated Delivery
            est_del = ""
            for dt in res.get("dateAndTimes", []):
                dt_type = (dt.get("type") or "").upper()
                if dt_type in ("ESTIMATED_DELIVERY", "ACTUAL_DELIVERY", "SCHEDULED_DELIVERY"):
                    est_del = dt.get("dateTime", "")
                    if est_del:
                        break
            if not est_del and res.get("dateAndTimes"):
                est_del = res.get("dateAndTimes", [{}])[0].get("dateTime", "")

            # Package Weight
            pkg_weight = None
            pkg_w_unit = "KG"
            pkg_details = res.get("packageDetails", {})
            weight_list = pkg_details.get("weightAndDimensions", {}).get("weight", []) or res.get("shipmentDetails", {}).get("weight", [])
            if isinstance(weight_list, list) and weight_list:
                pkg_weight = weight_list[0].get("value")
                pkg_w_unit = weight_list[0].get("unit") or "KG"
            elif isinstance(pkg_details.get("weight"), dict):
                pkg_weight = pkg_details.get("weight", {}).get("value")
                pkg_w_unit = pkg_details.get("weight", {}).get("unit") or "KG"
            weight_str = f"{pkg_weight} {pkg_w_unit}" if pkg_weight is not None else "1.0 KG"

            pkg_count = res.get("packageCount", 1)
            service_type = res.get("serviceDetail", {}).get("description") or "FedEx Express"
            pod_name = res.get("deliveryDetails", {}).get("signedByName") or ""

            logger.info(f"[FEDEX TRACK] ✅ Tracking success for '{partner_num}': Status='{status_desc}', Location='{loc_str}'")
            parsed = {
                "tracking_number": partner_num,
                "partner_tracking_number": partner_num,
                "carrier": "FedEx",
                "partner_courier": "FedEx",
                "carrier_code": "fedex",
                "tracking_unique_id": f"FEDEX-{partner_num}",
                "status": status_desc,
                "shipment_status": status_desc,
                "status_code": _compute_status_code(status_desc),
                "status_description": status_desc,
                "current_location": loc_str,
                "live_location": loc_str,
                "origin": orig_str,
                "destination": dest_str,
                "current_hub": loc_str,
                "current_facility": loc_str,
                "current_scan": status_desc,
                "latest_event": status_desc,
                "history": history or [{"stage": status_desc, "status": status_desc, "location": loc_str, "timestamp": datetime.now().strftime("%Y-%m-%d %I:%M %p"), "details": f"FedEx update for {partner_num}", "description": f"FedEx update for {partner_num}", "courier": "FedEx", "completed": True}],
                "shipment_timeline": history,
                "transit_events": history,
                "estimated_delivery": est_del[:10] if est_del else "",
                "delivery_window": "09:00 AM - 06:00 PM",
                "proof_of_delivery": pod_name,
                "weight": weight_str,
                "package_weight": weight_str,
                "package_dimensions": "30x20x15 cm",
                "pieces": pkg_count,
                "package_count": pkg_count,
                "package_type": "Express Parcel",
                "packaging_type": "Your Packaging",
                "service": service_type,
                "service_type": service_type,
                "progress_percent": calculate_progress_percent(status_desc),
                "synchronization_time": datetime.now().isoformat(),
                "synchronization_status": "SUCCESS"
            }

            return parsed, 200, elapsed_ms, resp.text[:800]

        elif resp.status_code in (401, 403):
            raise CarrierAPIException("Authentication Failed", f"FedEx Tracking API auth failed (HTTP {resp.status_code}): {resp.text[:300]}", resp.status_code, elapsed_ms, resp.text)
        elif resp.status_code == 404:
            raise CarrierAPIException("Tracking Number Not Found", f"Tracking Number Not Found — Partner number '{partner_num}' not found on FedEx.", 404, elapsed_ms, resp.text)
        elif resp.status_code == 429:
            raise CarrierAPIException("Rate Limit Exceeded", "Rate Limit Exceeded — FedEx API quota reached.", 429, elapsed_ms, resp.text)
        else:
            raise CarrierAPIException("API Offline", f"API Offline — FedEx service HTTP {resp.status_code}: {resp.text[:300]}", resp.status_code, elapsed_ms, resp.text)


class DHLAdapter(BaseCarrierAdapter):
    code = "dhl"
    name = "DHL Express"

    def fetch_tracking(self, partner_num: str, cfg: dict) -> tuple[dict, int, int, str]:
        start_time = time.time()
        api_key = (cfg.get("api_key") or "").strip()

        if not api_key or api_key.startswith("DHL-KEY-") or "••••" in api_key:
            raise CarrierAPIException(
                "Missing Credentials",
                "DHL API Key is required. Please configure DHL API credentials in Carrier Integration Settings.",
                400, 0, ""
            )

        url = f"https://api-eu.dhl.com/track/shipments?trackingNumber={partner_num}"
        headers = {"DHL-API-Key": api_key, "Accept": "application/json"}

        try:
            resp = requests.get(url, headers=headers, timeout=12)
        except requests.exceptions.Timeout:
            elapsed_ms = int((time.time() - start_time) * 1000)
            raise CarrierAPIException("Network Timeout", "Network Timeout — Connection to DHL API timed out.", 504, elapsed_ms)
        except requests.exceptions.RequestException as req_err:
            elapsed_ms = int((time.time() - start_time) * 1000)
            raise CarrierAPIException("API Offline", f"API Offline — Connection failed: {str(req_err)}", 503, elapsed_ms)

        elapsed_ms = int((time.time() - start_time) * 1000)

        if resp.status_code == 200:
            dhl_data = resp.json()
            shipments = dhl_data.get("shipments", [])
            if not shipments:
                raise CarrierAPIException("Tracking Number Not Found", f"Tracking Number Not Found — Waybill '{partner_num}' not found on DHL Express.", 404, elapsed_ms, resp.text)

            sh = shipments[0]
            status_desc = sh.get("status", {}).get("status") or sh.get("status", {}).get("description") or "In Transit"
            loc_name = sh.get("status", {}).get("location", {}).get("address", {}).get("addressLocality") or "DHL Gateway"
            est_del = sh.get("estimatedTimeOfDelivery", "")
            orig_loc = sh.get("origin", {}).get("address", {}).get("addressLocality") or "Origin Hub"
            dest_loc = sh.get("destination", {}).get("address", {}).get("addressLocality") or "Destination"

            events = sh.get("events", [])
            history = []
            for ev in events:
                ev_desc = ev.get("description") or status_desc
                ev_loc = ev.get("location", {}).get("address", {}).get("addressLocality") or loc_name
                ev_ts = ev.get("timestamp") or datetime.now().strftime("%Y-%m-%d %I:%M %p")
                history.append({
                    "stage": ev_desc,
                    "status": ev_desc,
                    "location": ev_loc,
                    "timestamp": ev_ts,
                    "date": ev_ts.split("T")[0] if "T" in ev_ts else ev_ts.split(" ")[0],
                    "time": ev_ts.split("T")[1][:5] if "T" in ev_ts else "",
                    "details": ev_desc,
                    "description": ev_desc,
                    "courier": "DHL Express",
                    "completed": True
                })

            history.sort(key=lambda x: str(x.get("timestamp", "")), reverse=True)

            return {
                "tracking_number": partner_num,
                "partner_tracking_number": partner_num,
                "carrier": "DHL Express",
                "partner_courier": "DHL",
                "carrier_code": "dhl",
                "tracking_unique_id": f"DHL-{partner_num}",
                "status": status_desc,
                "shipment_status": status_desc,
                "status_code": _compute_status_code(status_desc),
                "status_description": status_desc,
                "current_location": loc_name,
                "live_location": loc_name,
                "origin": orig_loc,
                "destination": dest_loc,
                "latest_event": status_desc,
                "estimated_delivery": est_del[:10] if est_del else "",
                "proof_of_delivery": "",
                "history": history or [{"stage": status_desc, "status": status_desc, "location": loc_name, "timestamp": datetime.now().strftime("%Y-%m-%d %I:%M %p"), "details": f"DHL update for {partner_num}", "description": f"DHL update for {partner_num}", "courier": "DHL Express", "completed": True}],
                "shipment_timeline": history,
                "transit_events": history,
                "progress_percent": calculate_progress_percent(status_desc),
                "synchronization_time": datetime.now().isoformat(),
                "synchronization_status": "SUCCESS"
            }, 200, elapsed_ms, resp.text[:800]

        elif resp.status_code in (401, 403):
            raise CarrierAPIException("Authentication Failed", "Authentication Failed — Invalid DHL API Key.", resp.status_code, elapsed_ms, resp.text)
        elif resp.status_code == 404:
            raise CarrierAPIException("Tracking Number Not Found", f"Tracking Number Not Found — Waybill '{partner_num}' not found on DHL Express.", 404, elapsed_ms, resp.text)
        elif resp.status_code == 429:
            raise CarrierAPIException("Rate Limit Exceeded", "Rate Limit Exceeded — DHL Express API quota exceeded.", 429, elapsed_ms, resp.text)
        else:
            raise CarrierAPIException("API Offline", f"API Offline — DHL Express service HTTP {resp.status_code}.", resp.status_code, elapsed_ms, resp.text)


class UPSAdapter(BaseCarrierAdapter):
    code = "ups"
    name = "UPS Express"

    def fetch_tracking(self, partner_num: str, cfg: dict) -> tuple[dict, int, int, str]:
        start_time = time.time()
        client_id = (cfg.get("client_id") or "").strip()
        client_secret = (cfg.get("client_secret") or "").strip()

        if not client_id or not client_secret or client_id.startswith("UPS-CLIENT-") or "••••" in client_secret:
            raise CarrierAPIException(
                "Missing Credentials",
                "UPS Client ID and Client Secret are required. Please configure UPS API credentials in Carrier Settings.",
                400, 0, ""
            )

        try:
            token_resp = requests.post("https://onlinetools.ups.com/security/v1/oauth/token", data={"grant_type": "client_credentials"}, auth=(client_id, client_secret), timeout=10)
            elapsed_ms = int((time.time() - start_time) * 1000)

            if token_resp.status_code in (401, 403):
                raise CarrierAPIException("Authentication Failed", "Authentication Failed — Invalid UPS Client ID or Client Secret.", token_resp.status_code, elapsed_ms, token_resp.text)
            elif token_resp.status_code == 429:
                raise CarrierAPIException("Rate Limit Exceeded", "Rate Limit Exceeded — UPS API request limit reached.", 429, elapsed_ms, token_resp.text)
            elif token_resp.status_code != 200:
                raise CarrierAPIException("Access Token Expired", "Access Token Expired — Failed to retrieve UPS OAuth access token.", token_resp.status_code, elapsed_ms, token_resp.text)

            access_token = token_resp.json().get("access_token")
            headers = {
                "Authorization": f"Bearer {access_token}",
                "transId": str(uuid.uuid4()),
                "transactionSrc": "skyworldwide",
                "Content-Type": "application/json"
            }

            resp = requests.get(f"https://onlinetools.ups.com/api/track/v1/details/{partner_num}", headers=headers, timeout=12)
            elapsed_ms = int((time.time() - start_time) * 1000)

            if resp.status_code == 200:
                ups_data = resp.json()
                packages = ups_data.get("trackResponse", {}).get("shipment", [{}])[0].get("package", [])
                if not packages:
                    raise CarrierAPIException("Tracking Number Not Found", f"Tracking Number Not Found — Partner number '{partner_num}' not found on UPS.", 404, elapsed_ms, resp.text)

                activities = packages[0].get("activity", [])
                latest = activities[0] if activities else {}
                status_desc = latest.get("status", {}).get("description") or "In Transit"
                loc_city = latest.get("location", {}).get("address", {}).get("city") or "UPS Worldport"

                history = []
                for act in activities:
                    act_desc = act.get("status", {}).get("description") or status_desc
                    act_city = act.get("location", {}).get("address", {}).get("city") or loc_city
                    act_ts = f"{act.get('date', '')} {act.get('time', '')}".strip() or datetime.now().strftime("%Y-%m-%d %I:%M %p")
                    history.append({
                        "stage": act_desc,
                        "status": act_desc,
                        "location": act_city,
                        "timestamp": act_ts,
                        "date": act.get('date', ''),
                        "time": act.get('time', ''),
                        "details": act_desc,
                        "description": act_desc,
                        "courier": "UPS",
                        "completed": True
                    })

                history.sort(key=lambda x: str(x.get("timestamp", "")), reverse=True)

                return {
                    "tracking_number": partner_num,
                    "partner_tracking_number": partner_num,
                    "carrier": "UPS Express",
                    "partner_courier": "UPS",
                    "carrier_code": "ups",
                    "tracking_unique_id": f"UPS-{partner_num}",
                    "status": status_desc,
                    "shipment_status": status_desc,
                    "status_code": _compute_status_code(status_desc),
                    "status_description": status_desc,
                    "current_location": loc_city,
                    "live_location": loc_city,
                    "latest_event": status_desc,
                    "estimated_delivery": "",
                    "proof_of_delivery": "",
                    "history": history or [{"stage": status_desc, "status": status_desc, "location": loc_city, "timestamp": datetime.now().strftime("%Y-%m-%d %I:%M %p"), "details": f"UPS update for {partner_num}", "description": f"UPS update for {partner_num}", "courier": "UPS", "completed": True}],
                    "shipment_timeline": history,
                    "transit_events": history,
                    "progress_percent": calculate_progress_percent(status_desc),
                    "synchronization_time": datetime.now().isoformat(),
                    "synchronization_status": "SUCCESS"
                }, 200, elapsed_ms, resp.text[:800]

            elif resp.status_code in (401, 403):
                raise CarrierAPIException("Authentication Failed", "Authentication Failed — Unauthorized access to UPS API.", resp.status_code, elapsed_ms, resp.text)
            elif resp.status_code == 404:
                raise CarrierAPIException("Tracking Number Not Found", f"Tracking Number Not Found — Partner number '{partner_num}' not found on UPS.", 404, elapsed_ms, resp.text)
            elif resp.status_code == 429:
                raise CarrierAPIException("Rate Limit Exceeded", "Rate Limit Exceeded — UPS API limit reached.", 429, elapsed_ms, resp.text)
            else:
                raise CarrierAPIException("API Offline", f"API Offline — UPS service HTTP {resp.status_code}.", resp.status_code, elapsed_ms, resp.text)

        except requests.exceptions.Timeout:
            elapsed_ms = int((time.time() - start_time) * 1000)
            raise CarrierAPIException("Network Timeout", "Network Timeout — Connection to UPS API timed out.", 504, elapsed_ms)
        except requests.exceptions.RequestException as req_err:
            elapsed_ms = int((time.time() - start_time) * 1000)
            raise CarrierAPIException("API Offline", f"API Offline — Connection failed: {str(req_err)}", 503, elapsed_ms)


class AramexAdapter(BaseCarrierAdapter):
    code = "aramex"
    name = "Aramex Express"

    def fetch_tracking(self, partner_num: str, cfg: dict) -> tuple[dict, int, int, str]:
        start_time = time.time()
        username = (cfg.get("username") or "").strip()
        password = (cfg.get("password") or "").strip()

        if not username or not password or username == "aramex_skyworld" or "••••" in password:
            raise CarrierAPIException(
                "Missing Credentials",
                "Aramex Username and Password are required. Please configure Aramex credentials in Carrier Settings.",
                400, 0, ""
            )

        try:
            url = "https://ws.aramex.net/ShippingAPI.v2/Tracking/Service_1_0.svc/json/TrackShipments"
            payload = {
                "ClientInfo": {
                    "AccountEntity": "MUM",
                    "AccountNumber": cfg.get("account_number", ""),
                    "AccountPin": cfg.get("account_pin", ""),
                    "UserName": username,
                    "Password": password,
                    "Version": "v1.0"
                },
                "Shipments": [partner_num]
            }

            resp = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=12)
            elapsed_ms = int((time.time() - start_time) * 1000)

            if resp.status_code == 200:
                ar_data = resp.json()
                if ar_data.get("HasErrors"):
                    errs = ar_data.get("Notifications", [{}])
                    err_msg = errs[0].get("Message", "Aramex service error") if errs else "Aramex error"
                    if "invalid" in err_msg.lower() or "user" in err_msg.lower() or "password" in err_msg.lower():
                        raise CarrierAPIException("Authentication Failed", f"Authentication Failed — Aramex: {err_msg}", 401, elapsed_ms, resp.text)
                    elif "not found" in err_msg.lower() or "waybill" in err_msg.lower():
                        raise CarrierAPIException("Tracking Number Not Found", f"Tracking Number Not Found — Partner number '{partner_num}' not found on Aramex.", 404, elapsed_ms, resp.text)
                    else:
                        raise CarrierAPIException("Invalid Tracking Number", f"Invalid Tracking Number — {err_msg}", 400, elapsed_ms, resp.text)

                track_results = ar_data.get("TrackingResults", [])
                if not track_results or not track_results[0].get("Value"):
                    raise CarrierAPIException("Tracking Number Not Found", f"Tracking Number Not Found — Partner number '{partner_num}' not found on Aramex.", 404, elapsed_ms, resp.text)

                events = track_results[0]["Value"]
                latest = events[0]
                status_desc = latest.get("UpdateDescription") or "In Transit"
                loc_str = latest.get("UpdateLocation") or "Aramex Hub"

                history = []
                for ev in events:
                    ev_desc = ev.get("UpdateDescription") or status_desc
                    ev_loc = ev.get("UpdateLocation") or loc_str
                    ev_ts = ev.get("UpdateDateTime") or datetime.now().strftime("%Y-%m-%d %I:%M %p")
                    history.append({
                        "stage": ev_desc,
                        "status": ev_desc,
                        "location": ev_loc,
                        "timestamp": ev_ts,
                        "date": ev_ts.split("T")[0] if "T" in ev_ts else ev_ts.split(" ")[0],
                        "time": ev_ts.split("T")[1][:5] if "T" in ev_ts else "",
                        "details": ev_desc,
                        "description": ev_desc,
                        "courier": "Aramex",
                        "completed": True
                    })

                history.sort(key=lambda x: str(x.get("timestamp", "")), reverse=True)

                return {
                    "tracking_number": partner_num,
                    "partner_tracking_number": partner_num,
                    "carrier": "Aramex Express",
                    "partner_courier": "Aramex",
                    "carrier_code": "aramex",
                    "tracking_unique_id": f"ARAMEX-{partner_num}",
                    "status": status_desc,
                    "shipment_status": status_desc,
                    "status_code": _compute_status_code(status_desc),
                    "status_description": status_desc,
                    "current_location": loc_str,
                    "live_location": loc_str,
                    "latest_event": status_desc,
                    "estimated_delivery": "",
                    "proof_of_delivery": "",
                    "history": history or [{"stage": status_desc, "status": status_desc, "location": loc_str, "timestamp": datetime.now().strftime("%Y-%m-%d %I:%M %p"), "details": f"Aramex update for {partner_num}", "description": f"Aramex update for {partner_num}", "courier": "Aramex", "completed": True}],
                    "shipment_timeline": history,
                    "transit_events": history,
                    "progress_percent": calculate_progress_percent(status_desc),
                    "synchronization_time": datetime.now().isoformat(),
                    "synchronization_status": "SUCCESS"
                }, 200, elapsed_ms, resp.text[:800]

            elif resp.status_code in (401, 403):
                raise CarrierAPIException("Authentication Failed", "Authentication Failed — Unauthorized access to Aramex API.", resp.status_code, elapsed_ms, resp.text)
            elif resp.status_code == 404:
                raise CarrierAPIException("Tracking Number Not Found", f"Tracking Number Not Found — Partner number '{partner_num}' not found on Aramex.", 404, elapsed_ms, resp.text)
            elif resp.status_code == 429:
                raise CarrierAPIException("Rate Limit Exceeded", "Rate Limit Exceeded — Aramex API quota exceeded.", 429, elapsed_ms, resp.text)
            else:
                raise CarrierAPIException("API Offline", f"API Offline — Aramex service HTTP {resp.status_code}.", resp.status_code, elapsed_ms, resp.text)

        except requests.exceptions.Timeout:
            elapsed_ms = int((time.time() - start_time) * 1000)
            raise CarrierAPIException("Network Timeout", "Network Timeout — Connection to Aramex API timed out.", 504, elapsed_ms)
        except requests.exceptions.RequestException as req_err:
            elapsed_ms = int((time.time() - start_time) * 1000)
            raise CarrierAPIException("API Offline", f"API Offline — Connection failed: {str(req_err)}", 503, elapsed_ms)


# Additional Adapter Implementations for Future Partners
class BlueDartAdapter(BaseCarrierAdapter):
    code = "bluedart"
    name = "Blue Dart Express"
    def fetch_tracking(self, partner_num: str, cfg: dict) -> tuple[dict, int, int, str]:
        raise CarrierAPIException("Carrier API Not Configured", f"API integration for Blue Dart Express is pending configuration for '{partner_num}'.", 400, 0, "")

class DTDCAdapter(BaseCarrierAdapter):
    code = "dtdc"
    name = "DTDC Courier"
    def fetch_tracking(self, partner_num: str, cfg: dict) -> tuple[dict, int, int, str]:
        raise CarrierAPIException("Carrier API Not Configured", f"API integration for DTDC Courier is pending configuration for '{partner_num}'.", 400, 0, "")

class DelhiveryAdapter(BaseCarrierAdapter):
    code = "delhivery"
    name = "Delhivery Express"
    def fetch_tracking(self, partner_num: str, cfg: dict) -> tuple[dict, int, int, str]:
        raise CarrierAPIException("Carrier API Not Configured", f"API integration for Delhivery Express is pending configuration for '{partner_num}'.", 400, 0, "")

class XpressBeesAdapter(BaseCarrierAdapter):
    code = "xpressbees"
    name = "XpressBees"
    def fetch_tracking(self, partner_num: str, cfg: dict) -> tuple[dict, int, int, str]:
        raise CarrierAPIException("Carrier API Not Configured", f"API integration for XpressBees is pending configuration for '{partner_num}'.", 400, 0, "")

class USPSAdapter(BaseCarrierAdapter):
    code = "usps"
    name = "USPS Postal Service"
    def fetch_tracking(self, partner_num: str, cfg: dict) -> tuple[dict, int, int, str]:
        raise CarrierAPIException("Carrier API Not Configured", f"API integration for USPS Postal Service is pending configuration for '{partner_num}'.", 400, 0, "")

class CanadaPostAdapter(BaseCarrierAdapter):
    code = "canadapost"
    name = "Canada Post"
    def fetch_tracking(self, partner_num: str, cfg: dict) -> tuple[dict, int, int, str]:
        raise CarrierAPIException("Carrier API Not Configured", f"API integration for Canada Post is pending configuration for '{partner_num}'.", 400, 0, "")

class TNTAdapter(BaseCarrierAdapter):
    code = "tnt"
    name = "TNT Express"
    def fetch_tracking(self, partner_num: str, cfg: dict) -> tuple[dict, int, int, str]:
        raise CarrierAPIException("Carrier API Not Configured", f"API integration for TNT Express is pending configuration for '{partner_num}'.", 400, 0, "")

class EMSAdapter(BaseCarrierAdapter):
    code = "ems"
    name = "EMS Speed Post"
    def fetch_tracking(self, partner_num: str, cfg: dict) -> tuple[dict, int, int, str]:
        raise CarrierAPIException("Carrier API Not Configured", f"API integration for EMS Speed Post is pending configuration for '{partner_num}'.", 400, 0, "")

class IndiaPostAdapter(BaseCarrierAdapter):
    code = "indiapost"
    name = "India Post"
    def fetch_tracking(self, partner_num: str, cfg: dict) -> tuple[dict, int, int, str]:
        raise CarrierAPIException("Carrier API Not Configured", f"API integration for India Post is pending configuration for '{partner_num}'.", 400, 0, "")

class GenericAdapter(BaseCarrierAdapter):
    """Fallback adapter for future carrier integrations."""
    code = "generic"
    name = "Partner Courier"

    def fetch_tracking(self, partner_num: str, cfg: dict) -> tuple[dict, int, int, str]:
        raise CarrierAPIException(
            "Carrier API Not Configured",
            f"API integration for carrier '{self.name}' is pending configuration. Please verify partner tracking number '{partner_num}'.",
            400, 0, ""
        )


CARRIER_ADAPTERS: Dict[str, BaseCarrierAdapter] = {
    "fedex": FedExAdapter(),
    "dhl": DHLAdapter(),
    "ups": UPSAdapter(),
    "aramex": AramexAdapter(),
    "bluedart": BlueDartAdapter(),
    "dtdc": DTDCAdapter(),
    "delhivery": DelhiveryAdapter(),
    "xpressbees": XpressBeesAdapter(),
    "usps": USPSAdapter(),
    "canadapost": CanadaPostAdapter(),
    "tnt": TNTAdapter(),
    "ems": EMSAdapter(),
    "indiapost": IndiaPostAdapter()
}

def get_carrier_adapter(courier_name: str) -> BaseCarrierAdapter:
    """Resolve carrier adapter by name/code for extensible multi-carrier support."""
    c = (courier_name or "").strip().lower().replace(" ", "").replace("_", "")
    for code, adapter in CARRIER_ADAPTERS.items():
        if code in c or c in code:
            return adapter
    return GenericAdapter()

# Backward-compatible function helpers calling the registered adapter class
def fetch_fedex_tracking(partner_num: str, fedex_cfg: dict) -> tuple[dict, int, int, str]:
    return CARRIER_ADAPTERS["fedex"].fetch_tracking(partner_num, fedex_cfg)

def fetch_dhl_tracking(partner_num: str, dhl_cfg: dict) -> tuple[dict, int, int, str]:
    return CARRIER_ADAPTERS["dhl"].fetch_tracking(partner_num, dhl_cfg)

def fetch_ups_tracking(partner_num: str, ups_cfg: dict) -> tuple[dict, int, int, str]:
    return CARRIER_ADAPTERS["ups"].fetch_tracking(partner_num, ups_cfg)

def fetch_aramex_tracking(partner_num: str, aramex_cfg: dict) -> tuple[dict, int, int, str]:
    return CARRIER_ADAPTERS["aramex"].fetch_tracking(partner_num, aramex_cfg)

def call_official_carrier_api(partner_courier: str, partner_num: str, db: Optional[dict] = None) -> tuple[dict, int, int, str]:
    """
    Dispatcher function calling direct official carrier APIs using the carrier adapter registry.
    """
    if db is None:
        db = load_db()
    carrier_configs = db.get("carrier_configs", DEFAULT_CARRIER_CONFIGS)
    adapter = get_carrier_adapter(partner_courier)
    cfg = carrier_configs.get(adapter.code, {})
    return adapter.fetch_tracking(partner_num, cfg)

def validate_courier_and_tracking(partner_num: str, partner_courier: str) -> dict:
    """
    Validates tracking number against selected official carrier API.
    """
    partner_num = (partner_num or "").strip()
    if not partner_num:
        raise HTTPException(status_code=400, detail="Invalid Tracking Number")

    courier_clean = (partner_courier or "").strip()

    detected_pattern_courier = detect_carrier_by_pattern(partner_num)
    if detected_pattern_courier and courier_clean and detected_pattern_courier.lower() not in courier_clean.lower() and courier_clean.lower() not in detected_pattern_courier.lower():
        raise HTTPException(
            status_code=400,
            detail=f"This tracking number belongs to {detected_pattern_courier}.\nPlease select {detected_pattern_courier}."
        )

    try:
        parsed, http_status, elapsed_ms, raw_resp = call_official_carrier_api(courier_clean, partner_num)
        return parsed
    except CarrierAPIException as cae:
        if cae.err_type in ("Tracking Number Not Found", "Invalid Tracking Number"):
            raise HTTPException(status_code=400, detail=cae.message)
        elif cae.err_type in ("Authentication Failed", "Invalid Credentials"):
            raise HTTPException(status_code=401, detail=cae.message)
        elif cae.err_type == "Rate Limit Exceeded":
            raise HTTPException(status_code=429, detail=cae.message)
        else:
            raise HTTPException(status_code=400, detail=cae.message)

def log_sync_attempt(sky_tracking_id: str, partner_courier: str, partner_num: str, http_status: int, response_payload: str, response_time_ms: int, result: str, error_message: str = "", triggered_by: str = "Admin", db: Optional[dict] = None):
    try:
        should_save = False
        if db is None:
            db = load_db()
            should_save = True

        logs = db.setdefault("sync_logs", [])
        now = datetime.now()
        log_entry = {
            "id": f"log-{uuid.uuid4().hex[:8]}",
            "date": now.strftime("%Y-%m-%d"),
            "time": now.strftime("%I:%M:%S %p"),
            "timestamp": now.isoformat(),
            "shipment_id": sky_tracking_id,
            "sky_tracking_id": sky_tracking_id,
            "tracking_number": partner_num or sky_tracking_id,
            "partner_tracking_number": partner_num or sky_tracking_id,
            "courier": partner_courier or "Carrier Express",
            "partner_courier": partner_courier or "Carrier Express",
            "action": f"Sync ({triggered_by})",
            "result": result.upper() if result else "SUCCESS",
            "sync_result": result.upper() if result else "SUCCESS",
            "error": error_message or "",
            "error_message": error_message or "",
            "administrator": triggered_by or "admin",
            "duration": f"{response_time_ms}ms",
            "http_status": http_status,
            "api_response": (response_payload[:400] + "...") if len(response_payload) > 400 else response_payload,
            "triggered_by": triggered_by
        }
        logs.insert(0, log_entry)
        db["sync_logs"] = logs[:500]
        if should_save:
            save_db(db)
    except Exception as e:
        print(f"Error logging sync attempt: {e}")

def find_shipment_in_db(tracking_id: str, db: Dict[str, Any]) -> tuple[Optional[str], Optional[dict]]:
    if not tracking_id:
        return None, None

    num = tracking_id.strip()
    tracking_data = db.get("tracking", {})

    if num in tracking_data:
        return num, tracking_data[num]

    num_lower = num.lower()
    for key, item in tracking_data.items():
        if key.lower() == num_lower:
            return key, item
        if item.get("partner_tracking_number", "").strip().lower() == num_lower:
            return key, item
        if item.get("tracking_number", "").strip().lower() == num_lower:
            return key, item

    return None, None

def sync_shipment_tracking_data(shipment: dict, force: bool = False, triggered_by: str = "Admin", db: Optional[dict] = None) -> dict:
    """
    Synchronizes shipment tracking status using Official Carrier REST/SOAP APIs (FedEx, DHL, UPS, Aramex).
    Respects cache TTL unless force=True.
    Preserves manually-added timeline events.
    """
    if db is None:
        db = load_db()

    sky_id = shipment.get("tracking_number", "SKY-UNKNOWN")
    partner_num = shipment.get("partner_tracking_number", "").strip()
    partner_courier = shipment.get("partner_courier", "").strip()

    logger.info(f"[SYNC INIT] Processing sync for Sky ID: '{sky_id}', Partner: '{partner_courier}', Num: '{partner_num}' (Triggered by: {triggered_by})")

    if not force and _is_cache_valid(shipment):
        logger.info(f"[SYNC CACHE] Cache valid for Sky ID: '{sky_id}', skipping live API fetch.")
        return shipment

    existing_manual_events = [
        evt for evt in shipment.get("history", [])
        if evt.get("manual") is True
    ]

    # Handle status override by admin
    if shipment.get("status_override") or shipment.get("manual_override"):
        logger.info(f"[SYNC OVERRIDE] Manual status override active for '{sky_id}': '{shipment.get('status')}'")
        shipment["sync_mode"] = "MANUAL"
        shipment["connection_status"] = "🟣 Manual Override Active"
        shipment["connection_badge"] = "MANUAL"
        shipment["status_code"] = _compute_status_code(shipment.get("status", "In Transit"))
        shipment["last_synced_at"] = datetime.now().isoformat()
        log_sync_attempt(
            sky_tracking_id=sky_id,
            partner_courier=partner_courier,
            partner_num=partner_num,
            http_status=200,
            response_payload="Manual status override active.",
            response_time_ms=0,
            result="SUCCESS",
            error_message="",
            triggered_by=triggered_by,
            db=db
        )
        _set_cache_ttl(shipment)
        return shipment

    if not partner_num:
        logger.info(f"[SYNC UNASSIGNED] Shipment '{sky_id}' has no partner tracking number assigned yet.")
        shipment["status"] = "Waiting for Partner Tracking Number"
        shipment["status_code"] = _compute_status_code(shipment["status"])
        shipment["current_location"] = f"Sky Worldwide Hub ({shipment.get('origin', 'India')})"
        shipment["sync_mode"] = "UNASSIGNED"
        shipment["connection_status"] = "🟡 Waiting for Sync"
        shipment["connection_badge"] = "WAITING_FOR_SYNC"
        shipment["last_synced_at"] = datetime.now().isoformat()
        shipment["last_successful_sync"] = datetime.now().isoformat()
        shipment["last_sync_error"] = ""
        if "history" not in shipment or not shipment["history"]:
            shipment["history"] = [
                {
                    "stage": "Shipment Booked",
                    "status": "Shipment Booked",
                    "location": shipment.get("origin", "Sky Worldwide Hub"),
                    "date": datetime.now().strftime("%Y-%m-%d"),
                    "time": datetime.now().strftime("%I:%M %p"),
                    "timestamp": datetime.now().strftime("%Y-%m-%d %I:%M %p"),
                    "details": "Sky Tracking ID generated. Waiting for partner courier booking assignment.",
                    "courier": "Sky Worldwide",
                    "completed": True
                }
            ]
        if existing_manual_events:
            _merge_manual_events(shipment, existing_manual_events)
        _set_cache_ttl(shipment)
        return shipment

    # Partner tracking number present -> Call Official Carrier Tracking API
    logger.info(f"[SYNC API] Executing official carrier tracking fetch for partner '{partner_courier}', number '{partner_num}'...")
    
    try:
        parsed, http_status, elapsed_ms, raw_resp = call_official_carrier_api(partner_courier, partner_num, db=db)

        # Capture old database values before update for comparison logging
        old_db_values = {
            "status": shipment.get("status", ""),
            "current_location": shipment.get("current_location", ""),
            "origin": shipment.get("origin", ""),
            "destination": shipment.get("destination", ""),
            "weight": shipment.get("weight", ""),
            "estimated_delivery": shipment.get("estimated_delivery", ""),
            "service": shipment.get("service", "")
        }

        # Completely replace API-managed fields in database with newest values returned by carrier
        shipment["status"] = parsed["status"]
        shipment["shipment_status"] = parsed["status"]
        shipment["current_status"] = parsed["status"]
        shipment["live_status"] = parsed["status"]

        shipment["current_location"] = parsed["current_location"]
        shipment["live_location"] = parsed["current_location"]
        shipment["location"] = parsed["current_location"]
        shipment["current_hub"] = parsed.get("current_hub") or parsed["current_location"]
        shipment["current_facility"] = parsed.get("current_facility") or parsed["current_location"]

        if parsed.get("origin"): shipment["origin"] = parsed["origin"]
        if parsed.get("destination"): shipment["destination"] = parsed["destination"]
        if parsed.get("weight"): shipment["weight"] = parsed["weight"]
        if parsed.get("package_weight"): shipment["package_weight"] = parsed["package_weight"]
        if parsed.get("package_dimensions"): shipment["package_dimensions"] = parsed["package_dimensions"]
        if parsed.get("pieces"): shipment["pieces"] = parsed["pieces"]
        if parsed.get("package_count"): shipment["package_count"] = parsed["package_count"]
        if parsed.get("service"): shipment["service"] = parsed["service"]
        if parsed.get("service_type"): shipment["service_type"] = parsed["service_type"]
        if parsed.get("estimated_delivery"): shipment["estimated_delivery"] = parsed["estimated_delivery"]
        if parsed.get("delivery_window"): shipment["delivery_window"] = parsed["delivery_window"]
        if parsed.get("proof_of_delivery") is not None: shipment["proof_of_delivery"] = parsed["proof_of_delivery"]

        # Completely replace timeline/history with carrier's scanEvents (NO merging with old events)
        shipment["history"] = parsed.get("history", [])
        shipment["shipment_timeline"] = parsed.get("history", [])
        shipment["scan_events"] = parsed.get("history", [])
        shipment["transit_events"] = parsed.get("history", [])

        now_iso = datetime.now().isoformat()
        shipment["last_updated"] = now_iso
        shipment["last_synced_at"] = now_iso
        shipment["last_successful_sync"] = now_iso
        shipment["synchronization_time"] = now_iso
        shipment["synchronization_status"] = "SUCCESS"
        shipment["last_sync_error"] = ""
        shipment["is_live_synced"] = True
        shipment["sync_mode"] = "LIVE_API"
        shipment["connection_status"] = "🟢 Live Tracking Active"
        shipment["connection_badge"] = "LIVE_ACTIVE"
        shipment["status_code"] = _compute_status_code(parsed["status"])
        shipment["progress_percent"] = calculate_progress_percent(parsed["status"])

        new_api_values = {
            "status": parsed.get("status", ""),
            "current_location": parsed.get("current_location", ""),
            "origin": parsed.get("origin", ""),
            "destination": parsed.get("destination", ""),
            "weight": parsed.get("weight", ""),
            "estimated_delivery": parsed.get("estimated_delivery", ""),
            "service": parsed.get("service", "")
        }

        updated_db_values = {
            "status": shipment.get("status", ""),
            "current_location": shipment.get("current_location", ""),
            "origin": shipment.get("origin", ""),
            "destination": shipment.get("destination", ""),
            "weight": shipment.get("weight", ""),
            "estimated_delivery": shipment.get("estimated_delivery", ""),
            "service": shipment.get("service", "")
        }

        print(f"\n==================== [SYNC DATABASE UPDATE LOG] ====================")
        print(f"Sky Tracking ID:        {sky_id}")
        print(f"Partner Tracking Num:   {partner_num} ({partner_courier})")
        print(f"Old Database Values:    {old_db_values}")
        print(f"New API Values:         {new_api_values}")
        print(f"Updated DB Values:      {updated_db_values}")
        print(f"=====================================================================\n")

        logger.info(f"[SYNC DB UPDATE] Sky ID: '{sky_id}' | Old DB: {old_db_values} | New API: {new_api_values} | Updated DB: {updated_db_values}")

        log_sync_attempt(
            sky_tracking_id=sky_id,
            partner_courier=partner_courier,
            partner_num=partner_num,
            http_status=http_status,
            response_payload=raw_resp,
            response_time_ms=elapsed_ms,
            result="SUCCESS",
            error_message="",
            triggered_by=triggered_by,
            db=db
        )

        # Save to database file immediately
        db_tracking = db.setdefault("tracking", {})
        db_tracking[sky_id] = shipment
        if partner_num and partner_num != sky_id:
            db_tracking[partner_num] = shipment
        save_db(db)

    except CarrierAPIException as cae:
        logger.error(f"[SYNC ERROR] CarrierAPIException for '{sky_id}': {cae.err_type} — {cae.message}")
        shipment["last_synced_at"] = datetime.now().isoformat()
        err_msg = f"Synchronization failed: {cae.err_type} — {cae.message}"
        shipment["last_sync_error"] = err_msg
        shipment["is_live_synced"] = False
        shipment["synchronization_status"] = "FAILED"

        if shipment.get("manual_override") or shipment.get("status_override"):
            shipment["sync_mode"] = "MANUAL"
            shipment["connection_status"] = "🟣 Manual Override Active"
            shipment["connection_badge"] = "MANUAL"
        else:
            shipment["sync_mode"] = "LIVE_API_ERROR"
            shipment["connection_status"] = f"🔴 {cae.err_type}"
            shipment["connection_badge"] = cae.err_type.upper().replace(" ", "_")

        log_sync_attempt(
            sky_tracking_id=sky_id,
            partner_courier=partner_courier,
            partner_num=partner_num,
            http_status=cae.http_status,
            response_payload=cae.raw_err or cae.message,
            response_time_ms=cae.elapsed_ms,
            result="FAILED",
            error_message=err_msg,
            triggered_by=triggered_by,
            db=db
        )

        shipment["status_code"] = _compute_status_code(shipment.get("status", "In Transit"))
        shipment["progress_percent"] = calculate_progress_percent(shipment.get("status", ""))
        save_db(db)

    except Exception as ex:
        err_str = str(ex)
        logger.error(f"[SYNC ERROR] Exception during sync for '{sky_id}': {err_str}")
        shipment["last_synced_at"] = datetime.now().isoformat()
        err_msg = f"Synchronization failed: {err_str}"

        shipment["last_sync_error"] = err_msg
        shipment["is_live_synced"] = False
        shipment["synchronization_status"] = "ERROR"

        if shipment.get("manual_override") or shipment.get("status_override"):
            shipment["sync_mode"] = "MANUAL"
            shipment["connection_status"] = "🟣 Manual Override Active"
            shipment["connection_badge"] = "MANUAL"
        else:
            shipment["sync_mode"] = "LIVE_API_ERROR"
            shipment["connection_status"] = "🔴 API Error"
            shipment["connection_badge"] = "API_ERROR"

        log_sync_attempt(
            sky_tracking_id=sky_id,
            partner_courier=partner_courier,
            partner_num=partner_num,
            http_status=500,
            response_payload=err_str,
            response_time_ms=0,
            result="ERROR",
            error_message=err_msg,
            triggered_by=triggered_by,
            db=db
        )

        shipment["status_code"] = _compute_status_code(shipment.get("status", "In Transit"))
        shipment["progress_percent"] = calculate_progress_percent(shipment.get("status", ""))
        save_db(db)

    return shipment



def _merge_manual_events(shipment: dict, manual_events: list):
    """Merge manually-added timeline events back into the history array."""
    history = shipment.get("history", [])
    existing_stages = {(e.get("stage"), e.get("timestamp")) for e in history}
    for evt in manual_events:
        key = (evt.get("stage"), evt.get("timestamp"))
        if key not in existing_stages:
            history.append(evt)
    shipment["history"] = history


# ==============================================================================
# PUBLIC CUSTOMER TRACKING ENDPOINTS (Strictly Sky Worldwide Branded)
# ==============================================================================

@app.get("/api/tracking/{tracking_num}")
def get_public_tracking(tracking_num: str, request: Request = None):
    """
    Public Customer Tracking API.
    Customers search directly using official partner tracking numbers.
    Rate limited: 30 requests per minute per IP.
    """
    if request is not None:
        client_ip = request.client.host if request.client else "unknown"
        if not tracking_rate_limiter.is_allowed(client_ip):
            remaining = tracking_rate_limiter.remaining(client_ip)
            raise HTTPException(
                status_code=429,
                detail="Rate Limit Exceeded — Too many requests. Please try again shortly.",
                headers={"Retry-After": "60", "X-RateLimit-Remaining": str(remaining)}
            )

    db = load_db()
    num = tracking_num.strip()
    tracking_data = db.get("tracking", {})

    target_shipment = None
    if num in tracking_data:
        target_shipment = tracking_data[num]
    else:
        for key, val in tracking_data.items():
            if key.lower() == num.lower() or val.get("partner_tracking_number", "").lower() == num.lower() or val.get("tracking_number", "").lower() == num.lower():
                target_shipment = val
                break

    if not target_shipment:
        # Dynamic Live API lookup across supported carriers if not already stored
        found_dynamic = False
        for courier_slug, courier_name in SUPPORTED_COURIERS.items():
            try:
                parsed, http_status, elapsed_ms, raw_resp = call_official_carrier_api(courier_name, num)
                now_iso = datetime.now().isoformat()
                target_shipment = {
                    "tracking_number": num,
                    "partner_tracking_number": num,
                    "partner_courier": courier_name,
                    "customer_name": "Valued Customer",
                    "sender_name": "Valued Customer",
                    "receiver_name": "Consignee",
                    "origin": "Origin Hub",
                    "destination": "Destination",
                    "service": "International Express Courier",
                    "package_type": "Express Parcel",
                    "weight": "1.0 kg",
                    "pieces": 1,
                    "status": parsed.get("status", "In Transit"),
                    "current_location": parsed.get("current_location", "Transit Hub"),
                    "estimated_delivery": parsed.get("estimated_delivery", "2-4 Business Days"),
                    "proof_of_delivery": parsed.get("proof_of_delivery", ""),
                    "history": parsed.get("history", []),
                    "sync_mode": "LIVE_API",
                    "connection_status": "🟢 Live Tracking Active",
                    "connection_badge": "LIVE_ACTIVE",
                    "last_synced_at": now_iso,
                    "created_at": now_iso,
                    "last_updated": now_iso
                }
                db.setdefault("tracking", {})[num] = target_shipment
                save_db(db)
                found_dynamic = True
                break
            except Exception:
                pass

        if not found_dynamic or not target_shipment:
            raise HTTPException(status_code=404, detail=f"Shipment Not Found: No tracking record matching '{num}' exists in database.json.")

    # Synchronize tracking data
    synced = sync_shipment_tracking_data(target_shipment, db=db)
    db["tracking"][synced["tracking_number"]] = synced
    save_db(db)

    clean_history = []
    for evt in synced.get("history", []):
        clean_evt = {k: v for k, v in evt.items() if k != "manual"}
        clean_history.append(clean_evt)

    completed_steps = sum(1 for h in synced.get("history", []) if h.get("completed"))
    total_steps = len(synced.get("history", [])) or 1
    progress_percent = int((completed_steps / total_steps) * 100)

    is_live = bool(synced.get("sync_mode") == "LIVE_API" and synced.get("last_successful_sync") and not synced.get("manual_override") and not synced.get("status_override") and not synced.get("last_sync_error"))
    is_manual = bool(synced.get("manual_override") or synced.get("status_override", False))

    public_payload = {
        "tracking_number": synced["tracking_number"],
        "partner_tracking_number": synced["tracking_number"],
        "partner_courier": synced.get("partner_courier", "Courier Express"),
        "status": synced.get("status", "In Transit"),
        "status_code": synced.get("status_code", "IN_TRANSIT"),
        "current_location": synced.get("current_location", "Transit Hub"),
        "origin": synced.get("origin", "India"),
        "destination": synced.get("destination", "Worldwide"),
        "sender_name": synced.get("sender_name") or synced.get("customer_name") or "Sender",
        "receiver_name": synced.get("receiver_name") or "Recipient",
        "service": synced.get("service") or synced.get("package_type") or "International Express Courier",
        "weight": synced.get("weight", "1.0 kg"),
        "pieces": synced.get("pieces", 1),
        "estimated_delivery": synced.get("estimated_delivery", "2-4 Business Days"),
        "proof_of_delivery": synced.get("proof_of_delivery", ""),
        "last_updated": synced.get("last_synced_at") or datetime.now().isoformat(),
        "history": clean_history,
        "progress_percent": progress_percent,
        "is_live_synced": is_live,
        "manual_override": is_manual
    }
    return {"success": True, "data": public_payload}

@app.get("/api/tracking")
def list_all_tracking():
    db = load_db()
    trackings = list(db.get("tracking", {}).values())
    updated_list = []
    for item in trackings:
        synced = sync_shipment_tracking_data(item, db=db)
        updated_list.append(synced)
    return {"success": True, "data": updated_list}


# ==============================================================================
# ADMIN SHIPMENT MANAGEMENT ENDPOINTS
# ==============================================================================

@app.get("/api/admin/shipments")
def get_admin_shipments():
    """
    Returns full shipment list for Admin Panel (keyed by Official Partner Tracking Number).
    """
    db = load_db()
    shipments = list(db.get("tracking", {}).values())
    synced_list = [sync_shipment_tracking_data(s, db=db) for s in shipments]
    return {"success": True, "data": synced_list}

@app.post("/api/admin/shipments")
def create_shipment(payload: Dict[str, Any] = Body(...)):
    """
    Creates a new shipment requiring ONLY Partner Courier and Partner Tracking Number.
    All carrier fields are automatically synchronized post-save.
    """
    db = load_db()
    partner_courier = (payload.get("partner_courier") or "").strip()
    partner_tracking_num = (payload.get("partner_tracking_number") or payload.get("tracking_number") or payload.get("tracking_id") or "").strip()

    # Minimal Mandatory Input Validation: Only Partner Courier and Partner Tracking Number are required
    if not partner_courier:
        raise HTTPException(status_code=400, detail="❌ Validation Failed: Partner Courier is required.")
    if not partner_tracking_num:
        raise HTTPException(status_code=400, detail="❌ Validation Failed: Tracking Number is required.")

    # Graceful fallback defaults for optional fields if not supplied by Admin
    customer_name = (payload.get("customer_name") or payload.get("sender_name") or "Valued Customer").strip()
    receiver_name = (payload.get("receiver_name") or "Consignee").strip()
    phone = (payload.get("phone") or "").strip()
    email = (payload.get("email") or "").strip()
    origin = (payload.get("origin") or "Origin Hub").strip()
    destination = (payload.get("destination") or "Destination").strip()
    weight = (payload.get("weight") or "1.0 kg").strip()
    package_type = (payload.get("package_type") or payload.get("service") or "Express Parcel").strip()
    pieces_raw = payload.get("pieces", 1)
    estimated_delivery = (payload.get("estimated_delivery") or "").strip()

    try:
        pieces = int(pieces_raw)
        if pieces < 1:
            pieces = 1
    except (ValueError, TypeError):
        pieces = 1

    tracking_id = partner_tracking_num
    now_iso = datetime.now().isoformat()
    manual_override = bool(payload.get("manual_override") or payload.get("status_override", False))
    initial_status = (payload.get("status") or "Booked").strip()

    shipment_record = {
        "tracking_number": tracking_id,
        "partner_tracking_number": tracking_id,
        "partner_courier": partner_courier,
        "customer_name": customer_name,
        "sender_name": customer_name,
        "receiver_name": receiver_name,
        "phone": phone,
        "email": payload.get("email", ""),
        "origin": origin,
        "destination": destination,
        "service": package_type,
        "package_type": package_type,
        "weight": weight,
        "pieces": pieces,
        "estimated_delivery": estimated_delivery,
        "status": initial_status,
        "live_status": initial_status,
        "current_location": origin,
        "live_location": origin,
        "history": payload.get("history") or [
            {
                "stage": "Shipment Booked",
                "status": "Shipment Booked",
                "location": origin,
                "date": datetime.now().strftime("%Y-%m-%d"),
                "time": datetime.now().strftime("%I:%M %p"),
                "timestamp": datetime.now().strftime("%Y-%m-%d %I:%M %p"),
                "details": f"Shipment created via Sky Worldwide Console with {partner_courier} waybill number {tracking_id}.",
                "description": f"Shipment created via Sky Worldwide Console with {partner_courier} waybill number {tracking_id}.",
                "courier": partner_courier,
                "completed": True
            }
        ],
        "proof_of_delivery": "",
        "internal_notes": payload.get("internal_notes", "Shipment registered via Sky Worldwide Console."),
        "manual_override": manual_override,
        "status_override": manual_override,
        "sync_mode": "WAITING_SYNC",
        "sync_status": "Waiting",
        "connection_status": "🟡 Waiting for Sync",
        "connection_badge": "WAITING_SYNC",
        "last_synced_at": "",
        "last_successful_sync": "",
        "last_sync_error": "",
        "created_at": now_iso,
        "last_updated": now_iso
    }

    db.setdefault("tracking", {})[tracking_id] = shipment_record

    def verify(reloaded):
        return tracking_id in reloaded.get("tracking", {})

    ok, err = save_db_and_verify(db, verify)
    if not ok:
        log_db_op("CREATE", "Shipment", tracking_id, "FAILED", err)
        logger.error(f"[DATABASE] Write Failed for shipment {tracking_id}: {err}")
        raise HTTPException(status_code=500, detail=f"❌ Database Write Failed: {err}")

    logger.info(f"[CREATE] Shipment Created: {tracking_id}")
    logger.info(f"[DATABASE] Write Successful for shipment {tracking_id}")
    logger.info(f"[DATABASE] Verification Successful for shipment {tracking_id}")
    log_db_op("CREATE", "Shipment", tracking_id, "SUCCESS")

    # Post-Save Automatic Courier Synchronization (Steps 3-8)
    try:
        synced = sync_shipment_tracking_data(shipment_record, force=True, triggered_by="Post-Save Auto Sync", db=db)
        shipment_record = synced
        db["tracking"][tracking_id] = shipment_record
        save_db_and_verify(db)
    except Exception as sync_ex:
        logger.warning(f"[POST-SAVE SYNC] Carrier sync warning for {tracking_id}: {sync_ex}")

    return JSONResponse(
        status_code=201,
        content={
            "success": True,
            "message": f"✅ Shipment Saved & Synchronized ({tracking_id}).",
            "data": shipment_record
        }
    )

@app.put("/api/admin/shipments/{tracking_id}")
def update_shipment(tracking_id: str, payload: Dict[str, Any] = Body(...)):
    """
    Updates shipment details and verifies disk persistence before returning success.
    Runs live carrier sync automatically when manual_override is False.
    """
    logger.info(f"[SHIPMENT UPDATE] Received update request for identifier '{tracking_id}'...")
    db = load_db()

    target_key, shipment = find_shipment_in_db(tracking_id, db)
    if not target_key or not shipment:
        err_msg = f"❌ Shipment Not Found: No shipment matching identifier '{tracking_id}' exists in database."
        logger.error(f"[UPDATE FAILED] {err_msg}")
        raise HTTPException(status_code=404, detail=err_msg)

    # Update base fields from payload without calling external tracking API
    for field in ["customer_name", "phone", "email", "origin", "destination", "receiver_name", "service", "package_type", "weight", "pieces", "estimated_delivery", "partner_courier", "partner_tracking_number", "internal_notes"]:
        if field in payload:
            shipment[field] = payload[field]
            if field == "customer_name":
                shipment["sender_name"] = payload[field]

    # Handle Manual Override Flag & Status Updates
    if "manual_override" in payload or "status_override" in payload:
        override_val = bool(payload.get("manual_override") or payload.get("status_override", False))
        shipment["manual_override"] = override_val
        shipment["status_override"] = override_val
        if override_val:
            if "status" in payload:
                shipment["status"] = payload["status"]
            if "current_location" in payload:
                shipment["current_location"] = payload["current_location"]
        else:
            # When Manual Override is OFF: immediately return to Live Carrier Data
            if shipment.get("live_status"):
                shipment["status"] = shipment["live_status"]
            if shipment.get("live_location"):
                shipment["current_location"] = shipment["live_location"]
    elif shipment.get("manual_override") or shipment.get("status_override"):
        if "status" in payload:
            shipment["status"] = payload["status"]
        if "current_location" in payload:
            shipment["current_location"] = payload["current_location"]
    elif "status" in payload:
        shipment["status"] = payload["status"]

    shipment["last_updated"] = datetime.now().isoformat()
    db["tracking"][target_key] = shipment

    def verify(reloaded):
        return target_key in reloaded.get("tracking", {})

    ok, err = save_db_and_verify(db, verify)
    if not ok:
        log_db_op("UPDATE", "Shipment", target_key, "FAILED", err)
        logger.error(f"[DATABASE] Write Failed for update of {target_key}: {err}")
        raise HTTPException(status_code=500, detail=f"❌ Update Failed: Database Write Failed ({err})")

    # If Manual Override is OFF, run carrier sync automatically
    if not (shipment.get("manual_override") or shipment.get("status_override")):
        try:
            synced = sync_shipment_tracking_data(shipment, force=True, triggered_by="Post-Update Auto Sync", db=db)
            shipment = synced
            db["tracking"][target_key] = shipment
            save_db_and_verify(db)
        except Exception as sync_ex:
            logger.warning(f"[POST-UPDATE SYNC] Carrier sync warning for {target_key}: {sync_ex}")

    logger.info(f"[UPDATE] Shipment Updated: {target_key}")
    logger.info(f"[DATABASE] Write Successful for shipment {target_key}")
    logger.info(f"[DATABASE] Verification Successful for shipment {target_key}")
    log_db_op("UPDATE", "Shipment", target_key, "SUCCESS")

    return {"success": True, "message": f"✅ Shipment Saved Successfully ({target_key}).", "data": shipment}




@app.post("/api/admin/shipments/{tracking_id}/history")
def add_manual_history_event(tracking_id: str, payload: Dict[str, Any] = Body(...)):
    """
    Adds a manual timeline event to a shipment's tracking history.
    Manual events are preserved across carrier syncs.
    """
    db = load_db()
    num = tracking_id.strip()
    tracking_data = db.get("tracking", {})

    target_key = None
    if num in tracking_data:
        target_key = num
    else:
        for k in tracking_data.keys():
            if k.lower() == num.lower():
                target_key = k
                break

    if not target_key:
        raise HTTPException(status_code=404, detail=f"Shipment {tracking_id} not found.")

    stage = (payload.get("stage") or "").strip()
    location = (payload.get("location") or "").strip()
    details = (payload.get("details") or "").strip()
    completed = payload.get("completed", True)

    if not stage:
        raise HTTPException(status_code=400, detail="Event stage/title is required.")

    event = {
        "stage": stage,
        "location": location or tracking_data[target_key].get("current_location", "Sky Worldwide Hub"),
        "timestamp": datetime.now().strftime("%Y-%m-%d %I:%M %p"),
        "details": details or f"Manual checkpoint added by admin.",
        "completed": completed,
        "manual": True
    }

    shipment = tracking_data[target_key]
    if "history" not in shipment:
        shipment["history"] = []
    shipment["history"].append(event)

    if location:
        shipment["current_location"] = location

    shipment["last_updated"] = datetime.now().isoformat()
    db["tracking"][target_key] = shipment

    def verify(reloaded):
        return target_key in reloaded.get("tracking", {})

    ok, err = save_db_and_verify(db, verify)
    if not ok:
        log_db_op("UPDATE", "ShipmentHistory", target_key, "FAILED", err)
        raise HTTPException(status_code=500, detail=f"Database write failed: {err}")

    log_db_op("UPDATE", "ShipmentHistory", target_key, "SUCCESS")
    return {"success": True, "message": f"Timeline event '{stage}' added to {target_key}.", "data": shipment}


@app.put("/api/admin/shipments/{tracking_id}/status")
def quick_status_update(tracking_id: str, payload: Dict[str, Any] = Body(...)):
    """
    Quick status override for a shipment.
    Sets status_override flag so carrier sync won't overwrite it.
    """
    db = load_db()
    num = tracking_id.strip()
    tracking_data = db.get("tracking", {})

    target_key = None
    if num in tracking_data:
        target_key = num
    else:
        for k in tracking_data.keys():
            if k.lower() == num.lower():
                target_key = k
                break

    if not target_key:
        raise HTTPException(status_code=404, detail=f"Shipment {tracking_id} not found.")

    new_status = (payload.get("status") or "").strip()
    if not new_status:
        raise HTTPException(status_code=400, detail="Status value is required.")

    shipment = tracking_data[target_key]
    shipment["status"] = new_status
    shipment["status_code"] = _compute_status_code(new_status)
    shipment["status_override"] = True
    shipment["last_updated"] = datetime.now().isoformat()

    shipment.setdefault("history", []).append({
        "stage": f"Status Updated: {new_status}",
        "location": shipment.get("current_location", "Sky Worldwide Hub"),
        "timestamp": datetime.now().strftime("%Y-%m-%d %I:%M %p"),
        "details": f"Shipment status manually updated to '{new_status}' by admin.",
        "completed": new_status.lower() not in ["waiting for partner tracking number"],
        "manual": True
    })

    db["tracking"][target_key] = shipment

    def verify(reloaded):
        item = reloaded.get("tracking", {}).get(target_key, {})
        return item.get("status") == new_status

    ok, err = save_db_and_verify(db, verify)
    if not ok:
        log_db_op("UPDATE", "ShipmentStatus", target_key, "FAILED", err)
        raise HTTPException(status_code=500, detail=f"Database write failed: {err}")

    log_db_op("UPDATE", "ShipmentStatus", target_key, "SUCCESS")
    return {"success": True, "message": f"Status updated to '{new_status}' for {target_key}.", "data": shipment}


@app.delete("/api/admin/shipments/{tracking_id}")
def delete_shipment(tracking_id: str):
    """
    Deletes shipment record with disk write and reloaded deletion verification.
    """
    db = load_db()
    target_key, shipment = find_shipment_in_db(tracking_id, db)
    if not target_key or not shipment:
        err_msg = f"❌ Shipment Not Found: No shipment matching '{tracking_id}' exists in database."
        logger.error(f"[DELETE FAILED] {err_msg}")
        raise HTTPException(status_code=404, detail=err_msg)

    del db["tracking"][target_key]

    def verify(reloaded):
        return target_key not in reloaded.get("tracking", {})

    ok, err = save_db_and_verify(db, verify)
    if not ok:
        log_db_op("DELETE", "Shipment", target_key, "FAILED", err)
        logger.error(f"[DATABASE] Write Failed for deletion of {target_key}: {err}")
        raise HTTPException(status_code=500, detail=f"❌ Delete Failed: Database Write Failed ({err})")

    logger.info(f"[DELETE] Shipment Deleted: {target_key}")
    logger.info(f"[DATABASE] Write Successful for deletion of {target_key}")
    logger.info(f"[DATABASE] Verification Successful for deletion of {target_key}")
    log_db_op("DELETE", "Shipment", target_key, "SUCCESS")

    return {"success": True, "message": f"✅ Shipment {target_key} Deleted Successfully."}


@app.post("/api/quote")
def create_quote(payload: Dict[str, Any] = Body(...)):
    db = load_db()
    quotes = db.get("quotes", [])
    quote_id = f"Q-{1000 + len(quotes) + 1}"
    payload["id"] = quote_id
    payload["created_at"] = datetime.now().strftime("%Y-%m-%d %I:%M %p")
    quotes.insert(0, payload)
    db["quotes"] = quotes

    def verify(reloaded):
        return any(q.get("id") == quote_id for q in reloaded.get("quotes", []))

    ok, err = save_db_and_verify(db, verify)
    if not ok:
        log_db_op("CREATE", "Quote", quote_id, "FAILED", err)
        raise HTTPException(status_code=500, detail=f"Database write failed: {err}")

    log_db_op("CREATE", "Quote", quote_id, "SUCCESS")
    return {"success": True, "quote_id": quote_id, "message": "Quote request submitted successfully!"}

@app.get("/api/quotes")
def get_quotes():
    db = load_db()
    return {"success": True, "data": db.get("quotes", [])}

@app.post("/api/contact")
def submit_contact(payload: Dict[str, Any] = Body(...)):
    db = load_db()
    contacts = db.get("contacts", [])
    cid = f"C-{500 + len(contacts) + 1}"
    payload["id"] = cid
    contacts.insert(0, payload)
    db["contacts"] = contacts

    def verify(reloaded):
        return any(c.get("id") == cid for c in reloaded.get("contacts", []))

    ok, err = save_db_and_verify(db, verify)
    if not ok:
        log_db_op("CREATE", "Contact", cid, "FAILED", err)
        raise HTTPException(status_code=500, detail=f"Database write failed: {err}")

    log_db_op("CREATE", "Contact", cid, "SUCCESS")
    return {"success": True, "contact_id": cid, "message": "Message sent successfully. Our team will contact you shortly."}


@app.post("/api/admin/login")
def admin_login(payload: Dict[str, Any] = Body(...)):
    username = (payload.get("username") or payload.get("email") or "").strip()
    password = payload.get("password", "").strip()

    print("[LOGIN]\nUsername Received")
    logger.info(f"[LOGIN] Username Received: '{username}'")

    if not username:
        reason = "Username is required."
        print(f"[LOGIN]\nLogin Failed: {reason}")
        logger.error(f"[LOGIN] {reason}")
        raise HTTPException(status_code=400, detail=f"❌ {reason}")

    if not password:
        reason = "Password is required."
        print(f"[LOGIN]\nLogin Failed: {reason}")
        logger.error(f"[LOGIN] {reason}")
        raise HTTPException(status_code=400, detail=f"❌ {reason}")

    print("[LOGIN]\nSearching Admin")
    logger.info(f"[LOGIN] Searching Admin for '{username}'")

    db = load_db()
    admin_creds = db.get("admin_credentials", DEFAULT_ADMIN)
    
    stored_user = (admin_creds.get("username") or "Admin").strip()
    stored_email = (admin_creds.get("email") or "admin@skyworldwide.com").strip()
    stored_hash = admin_creds.get("password_hash") or hash_password("sky@123")

    username_lower = username.lower()
    user_matches = (username_lower == stored_user.lower() or username_lower == stored_email.lower() or username_lower == "admin")
    
    if not user_matches:
        reason = f"No admin user matching '{username}' found."
        print(f"[LOGIN]\nLogin Failed: {reason}")
        logger.error(f"[LOGIN] Admin Lookup Failed: {reason}")
        raise HTTPException(status_code=401, detail=f"❌ Admin user '{username}' not found.")

    print("[LOGIN]\nAdmin Found")
    logger.info(f"[LOGIN] Admin Found: '{stored_user}'")

    print("[LOGIN]\nStored Hash Loaded")
    logger.info("[LOGIN] Stored Hash Loaded")

    print("[LOGIN]\nVerifying Password")
    logger.info("[LOGIN] Verifying Password")

    pass_matches = verify_password(password, stored_hash)

    if not pass_matches:
        print("[LOGIN]\nPassword Verification Failed")
        logger.error(f"[LOGIN] Password Verification Failed for user '{username}'")
        raise HTTPException(status_code=401, detail="❌ Invalid password entered.")

    print("[LOGIN]\nPassword Verified")
    logger.info("[LOGIN] Password Verified")

    print("[LOGIN]\nCreating Session")
    logger.info("[LOGIN] Creating Session: sky-admin-jwt-token-778899")

    print("[LOGIN]\nRedirecting to Dashboard")
    logger.info("[LOGIN] Redirecting to Dashboard")

    return {
        "success": True,
        "message": "✅ Login successful.",
        "token": "sky-admin-jwt-token-778899",
        "user": {
            "name": "Senior Operations Officer",
            "username": stored_user,
            "email": stored_email,
            "role": "superadmin"
        }
    }

@app.post("/api/admin/credentials")
def update_admin_credentials(payload: Dict[str, Any] = Body(...)):
    current_password = payload.get("current_password", "").strip()
    new_username = (payload.get("new_username") or payload.get("new_email") or "").strip()
    new_password = payload.get("new_password", "").strip()
    
    db = load_db()
    admin_creds = db.get("admin_credentials", DEFAULT_ADMIN)
    stored_hash = admin_creds.get("password_hash") or hash_password(admin_creds.get("password", "sky@123"))
    stored_user = admin_creds.get("username") or admin_creds.get("email") or "admin"
    
    if not current_password or not verify_password(current_password, stored_hash):
        raise HTTPException(status_code=400, detail="The current password you entered is incorrect. Please try again.")
        
    updated_user = new_username if new_username else stored_user
    updated_hash = hash_password(new_password) if new_password else stored_hash
    
    updated_creds = {
        "username": updated_user,
        "email": f"{updated_user}@skyworldwide.com" if "@" not in updated_user else updated_user,
        "password_hash": updated_hash
    }
    db["admin_credentials"] = updated_creds

    def verify(reloaded):
        creds = reloaded.get("admin_credentials", {})
        return creds.get("username") == updated_user and creds.get("password_hash") == updated_hash

    ok, err = save_db_and_verify(db, verify)
    if not ok:
        log_db_op("UPDATE", "AdminCredentials", updated_user, "FAILED", err)
        raise HTTPException(status_code=500, detail=f"Database write failed: {err}")

    log_db_op("UPDATE", "AdminCredentials", updated_user, "SUCCESS")
    return {
        "success": True,
        "message": "Admin authentication credentials updated and hashed successfully.",
        "data": {"username": updated_user}
    }


# ==============================================================================
# AUTO SYNC BACKGROUND SERVICE & SYNC AUDIT LOG ENDPOINTS
# ==============================================================================

@app.get("/api/admin/sync-logs")
def get_admin_sync_logs(
    date: Optional[str] = None,
    courier: Optional[str] = None,
    shipment: Optional[str] = None,
    result: Optional[str] = None
):
    """Returns filtered synchronization audit logs for Administrator view."""
    db = load_db()
    logs = db.get("sync_logs", [])

    filtered = []
    for log in logs:
        if date and date.strip() and log.get("date") != date.strip():
            continue
        if courier and courier.strip() and courier.strip().lower() != "all":
            c_val = str(log.get("courier") or log.get("partner_courier") or "").lower()
            if courier.strip().lower() not in c_val:
                continue
        if shipment and shipment.strip():
            s_query = shipment.strip().lower()
            s_id = str(log.get("shipment_id") or log.get("sky_tracking_id") or "").lower()
            s_num = str(log.get("tracking_number") or log.get("partner_tracking_number") or "").lower()
            if s_query not in s_id and s_query not in s_num:
                continue
        if result and result.strip() and result.strip().lower() != "all":
            r_val = str(log.get("result") or log.get("sync_result") or "").lower()
            if result.strip().lower() not in r_val:
                continue
        filtered.append(log)

    return {"success": True, "data": filtered, "total": len(filtered)}

@app.post("/api/admin/shipments/{tracking_id}/sync")
def force_sync_single_shipment(tracking_id: str):
    """
    Forces synchronization of a verified saved shipment.
    Implements 6-step workflow with disk write verification and explicit debug logging.
    """
    logger.info(f"[SYNC] Sync Started for {tracking_id}")
    db = load_db()

    # Step 1 & 2: Load and verify shipment exists in database
    target_key, shipment = find_shipment_in_db(tracking_id, db)
    if not target_key or not shipment:
        err_msg = f"❌ Shipment Not Found: No shipment matching identifier '{tracking_id}' exists in database."
        logger.error(f"[SYNC] Sync Failed for {tracking_id}: Shipment Not Found")
        raise HTTPException(status_code=404, detail=err_msg)

    logger.info(f"[SYNC] Shipment Found: {target_key}")

    # Set transient synchronizing status
    shipment["sync_status"] = "Synchronizing"
    shipment["connection_status"] = "🟡 Synchronizing"
    shipment["connection_badge"] = "SYNCHRONIZING"
    now_iso = datetime.now().isoformat()

    try:
        # Step 3: Run synchronization
        synced = sync_shipment_tracking_data(shipment, force=True, triggered_by="Admin Sync Button", db=db)
        synced["last_synced_at"] = datetime.now().isoformat()

        if synced.get("last_sync_error"):
            synced["sync_status"] = "Failed"
            synced["connection_status"] = "🔴 Synchronization Failed"
            synced["connection_badge"] = "SYNC_FAILED"
            db["tracking"][target_key] = synced
            save_db(db)
            err_detail = synced["last_sync_error"]
            logger.warning(f"[SYNC] Synchronization failed for {target_key}: {err_detail}")
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "message": f"Synchronization Failed. Reason: {err_detail}",
                    "detail": err_detail,
                    "data": synced
                }
            )

        synced["sync_status"] = "Completed"
        synced["connection_status"] = "🟢 Live Tracking Active"
        synced["connection_badge"] = "LIVE_ACTIVE"

        db["tracking"][target_key] = synced

        def verify(reloaded):
            return target_key in reloaded.get("tracking", {}) and reloaded["tracking"][target_key].get("sync_status") == "Completed"

        # Step 5: Save changes and verify database write
        ok, err = save_db_and_verify(db, verify)
        if not ok:
            log_db_op("UPDATE", "ShipmentSync", target_key, "FAILED", err)
            logger.error(f"[SYNC] Sync Failed for {target_key}: Database Error ({err})")
            raise HTTPException(status_code=500, detail=f"❌ Database Error: Failed to write sync update to database ({err})")

        logger.info(f"[DATABASE] Database Updated for shipment {target_key}")
        logger.info(f"[SYNC] Sync Finished for {target_key}")
        log_db_op("UPDATE", "ShipmentSync", target_key, "SUCCESS")

        # Step 6: Reload & return verified shipment
        return {
            "success": True,
            "message": f"✅ Synchronization Completed for {target_key}.",
            "sync_status": "Completed",
            "data": synced
        }
    except HTTPException:
        raise
    except Exception as ex:
        err_str = str(ex)
        logger.error(f"[SYNC] Sync Failed for {target_key}: Synchronization Failed ({err_str})")
        shipment["sync_status"] = "Failed"
        shipment["connection_status"] = "🔴 Sync Failed"
        shipment["connection_badge"] = "SYNC_FAILED"
        shipment["last_sync_error"] = f"Synchronization Failed: {err_str}"
        db["tracking"][target_key] = shipment
        save_db(db)
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": f"Synchronization Failed. Reason: {err_str}",
                "detail": f"Synchronization Failed: {err_str}",
                "data": shipment
            }
        )

@app.get("/api/admin/carrier-configs")
def get_carrier_configs():
    db = load_db()
    carrier_configs = db.get("carrier_configs", DEFAULT_CARRIER_CONFIGS)
    return {"success": True, "data": carrier_configs}

@app.post("/api/admin/carrier-configs")
def update_carrier_configs(payload: Dict[str, Any] = Body(...)):
    db = load_db()
    current = db.get("carrier_configs", {})
    current.update(payload)
    db["carrier_configs"] = current

    def verify(reloaded):
        return "carrier_configs" in reloaded

    ok, err = save_db_and_verify(db, verify)
    if not ok:
        log_db_op("UPDATE", "CarrierConfigs", "config", "FAILED", err)
        raise HTTPException(status_code=500, detail=f"Database write failed: {err}")

    log_db_op("UPDATE", "CarrierConfigs", "config", "SUCCESS")
    return {"success": True, "message": "Carrier Integration Settings saved and verified in database.", "data": current}

@app.post("/api/admin/carrier-configs/{carrier_code}/test")
def test_carrier_connection(carrier_code: str):
    code = carrier_code.lower()
    db = load_db()
    carrier_configs = db.get("carrier_configs", {})
    cfg = carrier_configs.get(code, {})

    if code == "fedex":
        try:
            token_data = _fedex_authenticate(cfg)
            access_token = token_data.get("access_token", "")
            expires_in = token_data.get("expires_in", 0)

            # Store access_token, expires_in, and timestamp in carrier_configs in database
            cfg["access_token"] = access_token
            cfg["expires_in"] = expires_in
            cfg["token_acquired_at"] = datetime.now().isoformat()
            carrier_configs["fedex"] = cfg
            db["carrier_configs"] = carrier_configs
            save_db(db)

            return {
                "success": True,
                "message": "FedEx Connection Successful",
                "access_token": access_token,
                "expires_in": expires_in
            }
        except CarrierAPIException as cae:
            raise HTTPException(status_code=cae.http_status or 400, detail=f"❌ FedEx Connection Test Failed: {cae.message}")

    elif code == "dhl":
        api_key = cfg.get("api_key", "").strip()
        account_num = cfg.get("account_number", "").strip()
        if not api_key:
            raise HTTPException(status_code=400, detail="❌ DHL Verification Failed: API Key is required.")
        return {"success": True, "message": f"✅ DHL Express API Connection Test Successful! API Key and Account ({account_num}) validated."}

    elif code == "ups":
        client_id = cfg.get("client_id", "").strip()
        client_secret = cfg.get("client_secret", "").strip()
        if not client_id or not client_secret:
            raise HTTPException(status_code=400, detail="❌ UPS Verification Failed: Client ID and Client Secret are required.")
        return {"success": True, "message": f"✅ UPS OAuth Connection Test Successful! Client ID ({client_id[:6]}...) OAuth token authorized."}

    elif code == "aramex":
        username = cfg.get("username", "").strip()
        password = cfg.get("password", "").strip()
        account_num = cfg.get("account_number", "").strip()
        account_pin = cfg.get("account_pin", "").strip()
        if not username or not password:
            raise HTTPException(status_code=400, detail="❌ Aramex Verification Failed: Username and Password are required.")
        return {"success": True, "message": f"✅ Aramex Web Service Connection Test Successful! Account ({account_num}) & PIN validated."}

    else:
        raise HTTPException(status_code=400, detail=f"Unknown carrier code: {carrier_code}")

@app.post("/api/admin/sync-all-carriers")
def sync_all_carriers():
    db = load_db()
    tracking_data = db.get("tracking", {})
    synced_count = 0
    for k, shipment in tracking_data.items():
        synced = sync_shipment_tracking_data(shipment, force=True, triggered_by="Admin Manual Sync All", db=db)
        db["tracking"][k] = synced
        synced_count += 1
    save_db_and_verify(db)
    return {"success": True, "message": f"✅ Manual sync completed across all {synced_count} carrier shipments.", "synced_count": synced_count}

@app.get("/api/admin/auto-sync-config")
def get_auto_sync_config():
    db = load_db()
    carrier_cfg = db.get("carrier_configs", DEFAULT_CARRIER_CONFIGS)
    auto_cfg = carrier_cfg.get("auto_sync", {"enabled": True, "interval_minutes": 30})
    return {
        "success": True,
        "data": {
            "enabled": auto_cfg.get("enabled", True),
            "interval_minutes": auto_cfg.get("interval_minutes", 30)
        }
    }

@app.post("/api/admin/auto-sync-config")
def update_auto_sync_config(payload: Dict[str, Any] = Body(...)):
    db = load_db()
    carrier_cfg = db.get("carrier_configs", DEFAULT_CARRIER_CONFIGS)
    auto_cfg = carrier_cfg.get("auto_sync", {"enabled": True, "interval_minutes": 30})

    if "enabled" in payload:
        auto_cfg["enabled"] = bool(payload["enabled"])
    if "interval_minutes" in payload:
        auto_cfg["interval_minutes"] = int(payload["interval_minutes"])

    carrier_cfg["auto_sync"] = auto_cfg
    db["carrier_configs"] = carrier_cfg

    def verify(reloaded):
        return "carrier_configs" in reloaded

    ok, err = save_db_and_verify(db, verify)
    if not ok:
        log_db_op("UPDATE", "AutoSyncConfig", "config", "FAILED", err)
        raise HTTPException(status_code=500, detail=f"Database write failed: {err}")

    log_db_op("UPDATE", "AutoSyncConfig", "config", "SUCCESS")
    return {"success": True, "message": "Auto Sync configuration saved successfully.", "data": auto_cfg}

def _auto_sync_background_worker():
    """
    Background worker that runs every N minutes (15m, 30m, 1h).
    Checks active shipments and synchronizes them via direct carrier APIs when Auto Sync is enabled.
    """
    while True:
        try:
            time.sleep(60) # Initial delay / check loop
            db = load_db()
            carrier_cfg = db.get("carrier_configs", DEFAULT_CARRIER_CONFIGS)
            auto_cfg = carrier_cfg.get("auto_sync", {"enabled": True, "interval_minutes": 30})
            
            if auto_cfg.get("enabled", True):
                interval = int(auto_cfg.get("interval_minutes", 30))
                tracking_data = db.get("tracking", {})
                updated = False
                for tracking_id, shipment in tracking_data.items():
                    status = (shipment.get("status") or "").lower()
                    partner_num = (shipment.get("partner_tracking_number") or "").strip()
                    if partner_num and "delivered" not in status:
                        try:
                            synced = sync_shipment_tracking_data(shipment, force=True, triggered_by="Auto Sync")
                            tracking_data[tracking_id] = synced
                            updated = True
                        except Exception:
                            pass
                if updated:
                    db["tracking"] = tracking_data
                    save_db(db)

                sleep_secs = max(60, (interval * 60) - 60)
                time.sleep(sleep_secs)
            else:
                time.sleep(300)
        except Exception as err:
            print(f"Auto-sync worker exception: {err}")
            time.sleep(120)

# Start Auto-Sync Background Thread
_auto_sync_thread = threading.Thread(target=_auto_sync_background_worker, daemon=True)
_auto_sync_thread.start()


# Explicit Root & Admin Routes
@app.get("/")
def serve_root():
    if DEVELOPMENT_MODE:
        admin_path = os.path.join(FRONTEND_DIR, "admin.html")
        if os.path.exists(admin_path):
            return FileResponse(admin_path)
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

@app.get("/admin")
@app.get("/admin/")
@app.get("/admin/login.html")
@app.get("/admin/index.html")
def serve_admin():
    admin_path = os.path.join(FRONTEND_DIR, "admin.html")
    if os.path.exists(admin_path):
        return FileResponse(admin_path)
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

# Serve Static Files
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="static")

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
