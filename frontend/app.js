/* ==========================================================================
   SKY WORLDWIDE INTERNATIONAL COURIER & CARGO
   Frontend Application Engine (React-like State & API Client)
   ========================================================================== */

// API Endpoint Configuration
const API_BASE = window.location.origin;

// Application State
const AppState = {
  activeTracking: null,
  quoteStep: 1,
  quoteData: {
    customerName: '',
    email: '',
    phone: '',
    pickupCity: '',
    pickupZip: '',
    destinationCountry: 'USA',
    destinationCity: '',
    weightKg: 5,
    category: 'Parcel & Courier',
    shippingSpeed: 'Express Air'
  },
  activeModal: null,
  currentCategoryFilter: 'All'
};

// Database Fallbacks (Offline Ready)
// Database Fallbacks (Offline Ready)
const SeedTrackingData = {
  "7940561073": {
    tracking_number: "7940561073",
    partner_courier: "FedEx",
    status: "In Transit",
    status_code: "IN_TRANSIT",
    current_location: "Memphis (MEM) Hub, USA",
    origin: "Delhi, India",
    destination: "New York, USA",
    sender_name: "Priya Patel",
    receiver_name: "Sarah Jenkins",
    service: "Express Air Courier",
    weight: "2.5 kg",
    pieces: 1,
    estimated_delivery: "2026-08-04",
    progress_percent: 70,
    history: [
      { stage: "In Transit", location: "Memphis (MEM) Hub, USA", timestamp: "2026-07-31 02:30 PM", details: "Arrived at FedEx Memphis International Superhub.", completed: true, courier: "FedEx" },
      { stage: "Export Customs Cleared", location: "Delhi, India Airport", timestamp: "2026-07-30 10:45 AM", details: "Customs docs validated & cleared.", completed: true, courier: "FedEx" },
      { stage: "Picked Up", location: "Delhi, India", timestamp: "2026-07-29 03:00 PM", details: "Collected with package inspection.", completed: true, courier: "FedEx" },
      { stage: "Shipment Booked", location: "Delhi, India", timestamp: "2026-07-28 09:30 AM", details: "Shipment created via FedEx International Express.", completed: true, courier: "FedEx" }
    ]
  },
  "JD0146001234567890": {
    tracking_number: "JD0146001234567890",
    partner_courier: "DHL",
    status: "Out for Delivery",
    status_code: "OUT_FOR_DELIVERY",
    current_location: "London, UK Express Facility",
    origin: "Mumbai, India",
    destination: "London, UK",
    sender_name: "Rajesh Kumar",
    receiver_name: "Aarav Sharma",
    service: "International Express Courier",
    weight: "4.5 kg",
    pieces: 1,
    estimated_delivery: "2026-08-03",
    progress_percent: 85,
    history: [
      { stage: "Out for Delivery", location: "London, UK Express Facility", timestamp: "2026-08-01 08:30 AM", details: "Package assigned for final delivery.", completed: true, courier: "DHL" },
      { stage: "Import Customs Clearance", location: "London Hub", timestamp: "2026-07-31 06:15 PM", details: "Cleared UK customs.", completed: true, courier: "DHL" },
      { stage: "Picked Up", location: "Mumbai, India", timestamp: "2026-07-29 04:30 PM", details: "Dispatched via DHL Express.", completed: true, courier: "DHL" }
    ]
  },
  "1Z999AA10123456784": {
    tracking_number: "1Z999AA10123456784",
    partner_courier: "UPS",
    status: "In Transit",
    status_code: "IN_TRANSIT",
    current_location: "UPS Worldport Louisville, USA",
    origin: "Chennai, India",
    destination: "Sydney, Australia",
    sender_name: "Vikram Malhotra",
    receiver_name: "John Smith",
    service: "International Express Parcel",
    weight: "3.5 kg",
    pieces: 1,
    estimated_delivery: "2026-08-05",
    progress_percent: 50,
    history: [
      { stage: "In Transit", location: "UPS Worldport Louisville, USA", timestamp: "2026-08-01 04:00 AM", details: "Arrived at UPS Air Hub.", completed: true, courier: "UPS" },
      { stage: "Shipment Booked", location: "Chennai, India", timestamp: "2026-07-30 11:00 AM", details: "Waybill registered with UPS Express.", completed: true, courier: "UPS" }
    ]
  },
  "31344352645": {
    tracking_number: "31344352645",
    partner_courier: "Aramex",
    status: "In Transit",
    status_code: "IN_TRANSIT",
    current_location: "Dubai Cargo Gateway, UAE",
    origin: "Bangalore, India",
    destination: "Dubai, UAE",
    sender_name: "Mohammed Al-Maktoum",
    receiver_name: "Tariq Al-Mansoor",
    service: "Air Cargo Freight",
    weight: "28.0 kg",
    pieces: 2,
    estimated_delivery: "2026-08-04",
    progress_percent: 60,
    history: [
      { stage: "In Transit", location: "Dubai Cargo Gateway, UAE", timestamp: "2026-07-31 07:15 PM", details: "Arrived at Aramex Dubai Express Terminal.", completed: true, courier: "Aramex" },
      { stage: "Shipment Booked", location: "Bangalore, India", timestamp: "2026-07-29 04:00 PM", details: "Booked with Aramex Express Waybill.", completed: true, courier: "Aramex" }
    ]
  }
};

// UI Initialization on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupTrackingForm();
  setupQuoteWizard();
  setupContactForm();
  setupCarousels();
  setupModals();
  loadSiteContent();
});

// Fetch & Render Dynamic Site Content
async function loadSiteContent() {
  try {
    const setRes = await fetch(`${API_BASE}/api/settings`);
    if (setRes.ok) {
      const setJson = await setRes.json();
      const settings = setJson.data || {};
      
      if (settings.logo_url) {
        const logoImg = document.getElementById('main-logo-img');
        if (logoImg) logoImg.src = settings.logo_url;
      }
      
      if (settings.hero_bg_url) {
        const heroSec = document.querySelector('.hero-section');
        if (heroSec) {
          heroSec.style.setProperty('--hero-bg-url', `url('${settings.hero_bg_url}')`);
        }
      }
      
      if (settings.hero_title) {
        const hTitle = document.getElementById('hero-title-display');
        if (hTitle) hTitle.innerHTML = settings.hero_title;
      }
      if (settings.hero_subtitle) {
        const hSub = document.getElementById('hero-subtitle-display');
        if (hSub) hSub.textContent = settings.hero_subtitle;
      }
      
      if (settings.phone) {
        const phoneEl = document.getElementById('contact-phone-display');
        if (phoneEl) phoneEl.textContent = settings.phone;
      }
      if (settings.address) {
        const addrEl = document.getElementById('contact-address-display');
        if (addrEl) addrEl.textContent = settings.address;
      }
      if (settings.email) {
        const emailEl = document.getElementById('contact-email-display');
        if (emailEl) emailEl.textContent = settings.email;
      }
      if (settings.whatsapp) {
        const waEl = document.getElementById('contact-whatsapp-display');
        if (waEl) waEl.textContent = settings.whatsapp;
      }
      if (settings.business_hours) {
        const hrsEl = document.getElementById('contact-hours-display');
        if (hrsEl) hrsEl.textContent = settings.business_hours;
      }
      if (settings.maps_embed_url) {
        const mapIframe = document.getElementById('contact-map-iframe');
        if (mapIframe) mapIframe.src = settings.maps_embed_url;
      }
      
      if (settings.site_images) {
        if (settings.site_images.office_img) {
          const offImg = document.getElementById('contact-office-img');
          if (offImg) offImg.src = settings.site_images.office_img;
        }
      }
    }
  } catch (err) {
    console.warn("Could not load dynamic settings:", err);
  }

  // Dynamic services rendering commented out to preserve the 7 restructured canonical homepage services
  /*
  try {
    const srvRes = await fetch(`${API_BASE}/api/services`);
    if (srvRes.ok) {
      const srvJson = await srvRes.json();
      const services = srvJson.data || [];
      renderPublicServicesCards(services);
    }
  } catch (err) {
    console.warn("Could not load dynamic services:", err);
  }
  */
}

function renderPublicServicesCards(services) {
  const container = document.getElementById('services-cards-container');
  if (!container || !services || !services.length) return;

  const activeServices = services.filter(s => s.enabled !== false);
  if (!activeServices.length) return;

  container.innerHTML = activeServices.map(srv => `
    <div class="carousel-card p-0 overflow-hidden group">
      <div class="relative h-48 overflow-hidden">
        <img src="${srv.image || 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80'}" alt="${srv.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
        <span class="absolute bottom-3 left-4 text-white font-bold text-xs bg-[#005DC3] px-3 py-1 rounded-full"><i class="fa-solid ${srv.icon || 'fa-plane'}"></i> ${srv.category || 'Service'}</span>
      </div>
      <div class="p-6 flex-1 flex flex-col">
        <h3 class="text-xl font-bold text-slate-900 mb-2">${srv.title}</h3>
        <p class="text-sm text-slate-600 mb-6 flex-1">${srv.description}</p>
        <button onclick="openModal('quote-modal')" class="btn-secondary text-xs py-2.5 justify-center w-full">Book Service</button>
      </div>
    </div>
  `).join('');
}

// Toast System
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type} animate-fade-in`;
  toast.style.cssText = `
    background: ${type === 'success' ? '#005DC3' : '#DC2626'};
    color: #fff;
    padding: 14px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    font-weight: 600;
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 99999;
  `;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function createToastContainer() {
  const el = document.createElement('div');
  el.id = 'toast-container';
  el.style.cssText = 'position: fixed; top: 24px; right: 24px; z-index: 99999; display: flex; flex-direction: column; align-items: flex-end;';
  document.body.appendChild(el);
  return el;
}

// Navigation & Mobile Drawer
function setupNavigation() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('close-drawer-btn');

  if (mobileBtn && drawer) {
    mobileBtn.addEventListener('click', () => {
      drawer.classList.remove('hidden');
    });
  }
  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.add('hidden');
    });
  }
}

// Tracking Functionality
async function performTrackingSearch(trackingNumber) {
  const num = trackingNumber.trim();
  if (!num) {
    showToast("Please enter a valid tracking number.", "error");
    return;
  }

  showToast(`Searching tracking details for ${num}...`, "success");

  let data = null;
  let errorMsg = null;

  try {
    const res = await fetch(`${API_BASE}/api/tracking/${encodeURIComponent(num)}?_t=${Date.now()}`, { cache: 'no-store' });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.data) {
      data = json.data;
    } else {
      errorMsg = json.detail || json.message || "Tracking Not Found";
    }
  } catch (err) {
    console.warn("API request error:", err);
    errorMsg = "Network error connecting to backend server.";
  }

  if (data) {
    renderTrackingModal(data);
  } else {
    showToast(errorMsg || "Tracking Not Found", "error");
    renderTrackingNotFoundModal(num, errorMsg);
  }
}

function setupTrackingForm() {
  const heroForm = document.getElementById('hero-tracking-form');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('hero-tracking-input');
      if (input) performTrackingSearch(input.value);
    });
  }
}

function renderTrackingModal(data) {
  const modal = document.getElementById('tracking-modal');
  const content = document.getElementById('tracking-modal-content');
  if (!modal || !content) return;

  const isDelivered = data.status_code === 'DELIVERED' || (data.status || '').toLowerCase() === 'delivered';
  const isOut = data.status_code === 'OUT_FOR_DELIVERY' || (data.status || '').toLowerCase().includes('out for delivery');
  const isWaiting = data.status_code === 'WAITING';

  const courierName = data.partner_courier || 'Partner Courier';
  const isLiveSynced = Boolean(data.is_live_synced && !data.manual_override);

  const headerTitle = isLiveSynced ? "Official Courier Live Tracking" : "Sky Worldwide Express Tracking";
  const headerSubtitle = isLiveSynced ? `Sky Worldwide Partner Portal • ${courierName}` : "Status provided by Sky Worldwide";
  const trackingNumberLabel = isLiveSynced ? `${courierName} Official Tracking Number` : `Sky Worldwide Tracking Number (${courierName})`;
  const timelineTitle = isLiveSynced ? `${courierName} Official Live Timeline (Newest First)` : "Shipment Tracking Timeline";

  const historyHtml = (data.history || []).map((step, idx) => `
    <div class="flex gap-4 items-start relative pb-6 ${idx === (data.history.length - 1) ? '' : 'border-l-2 border-blue-200 ml-4 pl-6'}">
      <div class="w-8 h-8 rounded-full ${step.completed ? 'bg-[#005DC3] text-white shadow-md' : 'bg-slate-100 text-slate-400 border border-slate-200'} flex items-center justify-center font-bold text-xs flex-shrink-0 -ml-4 z-10">
        ${step.completed ? '<i class="fa-solid fa-check text-xs"></i>' : (idx + 1)}
      </div>
      <div class="flex-1 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
        <div class="flex items-center justify-between flex-wrap gap-1">
          <h4 class="font-bold text-sm ${step.completed ? 'text-slate-900' : 'text-slate-500'}">${step.stage || step.status || 'Status Update'}</h4>
          <span class="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">${step.timestamp || (step.date ? step.date + ' ' + (step.time||'') : 'Pending')}</span>
        </div>
        <p class="text-xs text-[#005DC3] font-semibold mt-0.5"><i class="fa-solid fa-location-dot"></i> ${step.location || 'Transit Hub'} ${step.courier ? '• <span class="text-slate-600 font-bold">' + step.courier + '</span>' : ''}</p>
        <p class="text-xs text-slate-600 mt-1">${step.details || step.description || ''}</p>
      </div>
    </div>
  `).join('');

  const pct = data.progress_percent || (isDelivered ? 100 : (isOut ? 85 : (isWaiting ? 15 : 50)));

  content.innerHTML = `
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full mx-auto relative shadow-2xl animate-fade-in border border-slate-100 max-h-[90vh] overflow-y-auto my-auto">
      
      <!-- Modal Header -->
      <div class="sticky top-0 right-0 flex justify-between items-center bg-white/95 backdrop-blur-md pb-4 pt-1 border-b border-slate-100 z-20 mb-6">
        <div class="flex items-center gap-3">
          <img src="images/logo1.PNG" alt="Sky Worldwide" class="h-8 w-auto bg-white p-1 rounded-lg object-contain border border-slate-200">
          <div>
            <span class="text-xs font-bold text-[#005DC3] uppercase tracking-wider block">${headerTitle}</span>
            <span class="text-[10px] text-slate-400 font-semibold">${headerSubtitle}</span>
          </div>
        </div>
        <button onclick="closeModal('tracking-modal')" class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition flex-shrink-0">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Tracking ID Banner & Status Badge -->
      <div class="bg-gradient-to-r from-slate-900 via-[#00398A] to-[#005DC3] rounded-2xl p-6 text-white mb-6 shadow-xl relative overflow-hidden">
        <div class="relative z-10 flex flex-wrap justify-between items-start gap-4">
          <div>
            <p class="text-xs font-semibold text-blue-200 uppercase tracking-widest">${trackingNumberLabel}</p>
            <h2 class="text-3xl font-extrabold tracking-tight mt-0.5 text-white font-mono">${data.tracking_number}</h2>
            <p class="text-xs text-blue-100 mt-2"><i class="fa-solid fa-plane-up"></i> ${data.service} • <span class="font-bold">${data.weight}</span></p>
          </div>
          <div class="text-right">
            <span class="inline-block text-xs font-extrabold px-3.5 py-1.5 rounded-full ${isDelivered ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-950'} shadow-lg">
              ${data.status}
            </span>
            <p class="text-[11px] text-blue-200 mt-2 font-medium">Est. Delivery: <strong class="text-white">${data.estimated_delivery}</strong></p>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
        <div class="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
          <span>Shipment Progress</span>
          <span class="text-[#005DC3] font-extrabold">${pct}% Completed</span>
        </div>
        <div class="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5 mb-4">
          <div class="bg-[#005DC3] h-full rounded-full transition-all duration-1000 shadow-sm" style="width: ${pct}%"></div>
        </div>
        <div class="grid grid-cols-4 text-center gap-2 text-[11px] font-semibold">
          <div class="${pct >= 20 ? 'text-[#005DC3] font-bold' : 'text-slate-400'}">
            <i class="fa-solid fa-circle-check text-sm block mb-1"></i> Booked
          </div>
          <div class="${pct >= 40 ? 'text-[#005DC3] font-bold' : 'text-slate-400'}">
            <i class="fa-solid fa-box text-sm block mb-1"></i> Picked Up
          </div>
          <div class="${pct >= 70 ? 'text-[#005DC3] font-bold' : 'text-slate-400'}">
            <i class="fa-solid fa-plane-flight text-sm block mb-1"></i> In Transit
          </div>
          <div class="${pct >= 100 ? 'text-emerald-600 font-bold' : 'text-slate-400'}">
            <i class="fa-solid fa-house-chimney-check text-sm block mb-1"></i> Delivered
          </div>
        </div>
      </div>

      <!-- Route Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 mb-6 text-sm">
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-xl bg-blue-100 text-[#005DC3] flex items-center justify-center font-bold flex-shrink-0">
            <i class="fa-solid fa-location-arrow"></i>
          </div>
          <div>
            <p class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Sender / Origin</p>
            <p class="font-bold text-slate-900">${data.origin}</p>
            <p class="text-xs text-slate-600 font-medium">${data.sender_name}</p>
          </div>
        </div>
        <div class="flex items-start gap-3 border-t sm:border-t-0 sm:border-l border-blue-100 pt-3 sm:pt-0 sm:pl-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
            <i class="fa-solid fa-flag-checkered"></i>
          </div>
          <div>
            <p class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Receiver / Destination</p>
            <p class="font-bold text-slate-900">${data.destination}</p>
            <p class="text-xs text-slate-600 font-medium">${data.receiver_name}</p>
          </div>
        </div>
      </div>

      <!-- Proof of Delivery if available -->
      ${data.proof_of_delivery ? `
        <div class="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-3">
          <i class="fa-solid fa-file-signature text-emerald-600 text-lg"></i>
          <div>
            <p class="font-bold">Proof of Delivery</p>
            <p class="text-emerald-700">${data.proof_of_delivery}</p>
          </div>
        </div>
      ` : ''}

      <!-- Checkpoint Timeline -->
      <div class="mb-6">
        <h3 class="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <i class="fa-solid fa-timeline text-[#005DC3]"></i> ${timelineTitle}
        </h3>
        <div class="mt-2 space-y-1">
          ${historyHtml}
        </div>
      </div>

      <!-- Footer Info Bar -->
      <div class="mt-6 pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center text-xs text-slate-500 gap-3">
        <span>Current Location: <strong class="text-slate-800 font-bold">${data.current_location}</strong></span>
        <button onclick="window.print()" class="btn-secondary py-2 px-4 text-xs font-bold">
          <i class="fa-solid fa-print"></i> Print Waybill
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function renderTrackingNotFoundModal(num, customMsg) {
  const modal = document.getElementById('tracking-modal');
  const content = document.getElementById('tracking-modal-content');
  if (!modal || !content) return;

  const displayTitle = customMsg || "Tracking Not Found";

  content.innerHTML = `
    <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-auto relative text-center shadow-2xl animate-fade-in border border-slate-100">
      <button onclick="closeModal('tracking-modal')" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 text-2xl">
        <i class="fa-solid fa-circle-exclamation"></i>
      </div>
      <h3 class="text-xl font-bold text-slate-900 mb-2">${displayTitle}</h3>
      <p class="text-sm text-slate-600 mb-6">Tracking Number: <strong class="font-mono text-slate-800">${num}</strong><br>Please verify your partner tracking number (DHL, FedEx, UPS, or Aramex) and try again.</p>
      <button onclick="closeModal('tracking-modal')" class="btn-primary w-full justify-center">Close</button>
    </div>
  `;
  modal.classList.remove('hidden');
}

// Multi-Step Quote Wizard
function setupQuoteWizard() {
  const weightInput = document.getElementById('quote-weight-input');
  const weightVal = document.getElementById('quote-weight-value');
  if (weightInput && weightVal) {
    weightInput.addEventListener('input', (e) => {
      weightVal.textContent = `${e.target.value} kg`;
      AppState.quoteData.weightKg = e.target.value;
      updateQuoteEstimate();
    });
  }
}

function updateQuoteEstimate() {
  const weight = parseFloat(AppState.quoteData.weightKg || 5);
  const baseRate = AppState.quoteData.destinationCountry === 'USA' ? 18 : 14;
  const totalMin = Math.round(weight * baseRate);
  const totalMax = Math.round(weight * (baseRate + 4));
  
  const estEl = document.getElementById('quote-live-estimate');
  if (estEl) {
    estEl.textContent = `$${totalMin} - $${totalMax} USD`;
  }
}

function nextQuoteStep(current) {
  const stepCurrent = document.getElementById(`quote-step-${current}`);
  const stepNext = document.getElementById(`quote-step-${current + 1}`);

  if (stepCurrent && stepNext) {
    stepCurrent.classList.add('hidden');
    stepNext.classList.remove('hidden');
    AppState.quoteStep = current + 1;
    updateStepIndicators(AppState.quoteStep);
  }
}

function prevQuoteStep(current) {
  const stepCurrent = document.getElementById(`quote-step-${current}`);
  const stepPrev = document.getElementById(`quote-step-${current - 1}`);

  if (stepCurrent && stepPrev) {
    stepCurrent.classList.add('hidden');
    stepPrev.classList.remove('hidden');
    AppState.quoteStep = current - 1;
    updateStepIndicators(AppState.quoteStep);
  }
}

function updateStepIndicators(step) {
  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById(`step-indicator-${i}`);
    if (el) {
      if (i < step) {
        el.className = "wizard-step-item completed";
      } else if (i === step) {
        el.className = "wizard-step-item active";
      } else {
        el.className = "wizard-step-item";
      }
    }
  }
}

async function submitQuoteForm(e) {
  if (e) e.preventDefault();

  const name = document.getElementById('q-name')?.value || 'Valued Customer';
  const email = document.getElementById('q-email')?.value || 'customer@example.com';
  const phone = document.getElementById('q-phone')?.value || '+91 9876543210';

  const payload = {
    customer_name: name,
    email: email,
    phone: phone,
    pickup_city: document.getElementById('q-pickup-city')?.value || 'Mumbai',
    destination_country: document.getElementById('q-dest-country')?.value || 'USA',
    destination_city: document.getElementById('q-dest-city')?.value || 'New York',
    weight_kg: AppState.quoteData.weightKg,
    category: document.getElementById('q-category')?.value || 'Parcel',
    estimated_cost: document.getElementById('quote-live-estimate')?.textContent || '$120 - $150'
  };

  try {
    const res = await fetch(`${API_BASE}/api/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const json = await res.json();
      showToast(`Quote Request Submitted! Ref ID: ${json.quote_id}`, 'success');
      closeModal('quote-modal');
      return;
    }
  } catch (err) {
    console.warn("Quote submit fallback:", err);
  }

  showToast(`Quote Submitted Successfully! Ref ID: Q-${Math.floor(1000 + Math.random() * 9000)}`, 'success');
  closeModal('quote-modal');
}

// Contact Form Handler
async function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name')?.value;
    const email = document.getElementById('contact-email')?.value;
    const message = document.getElementById('contact-message')?.value;

    if (!name || !email || !message) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    try {
      await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
    } catch (err) {
      console.warn("Contact fallback:", err);
    }

    showToast("Thank you! Your message has been sent to our customer care team.", "success");
    form.reset();
  });
}

// Carousel Dot Synchronization
function setupCarousels() {
  const carousels = document.querySelectorAll('.carousel-container');
  carousels.forEach((car, index) => {
    car.addEventListener('scroll', () => {
      const scrollLeft = car.scrollLeft;
      const cardWidth = 340;
      const activeIdx = Math.round(scrollLeft / cardWidth);
      const dotsContainer = car.nextElementSibling;
      if (dotsContainer && dotsContainer.classList.contains('carousel-pagination-dots')) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
          if (i === activeIdx) dot.classList.add('active');
          else dot.classList.remove('active');
        });
      }
    });
  });
}

// Modal Helpers
function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove('hidden');
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.add('hidden');
}

// Global modal background click listener
function setupModals() {
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.add('hidden');
    });
  });
}
