"""
Automated Test Suite for Universal Multi-Carrier Live Tracking Engine
Tests backend functions directly.
"""
import unittest
from server import (
    load_db, save_db, create_shipment, sync_shipment_tracking_data,
    get_public_tracking, get_admin_sync_logs,
    PROTECTED_CUSTOMER_FIELDS, calculate_progress_percent,
    call_official_carrier_api, get_carrier_adapter, FedExAdapter, DHLAdapter, UPSAdapter, AramexAdapter
)

class TestMultiCarrierEngine(unittest.TestCase):

    def test_01_carrier_adapters_registration(self):
        """Verify adapters for supported and future couriers resolve correctly."""
        self.assertIsInstance(get_carrier_adapter("FedEx"), FedExAdapter)
        self.assertIsInstance(get_carrier_adapter("DHL"), DHLAdapter)
        self.assertIsInstance(get_carrier_adapter("UPS"), UPSAdapter)
        self.assertIsInstance(get_carrier_adapter("Aramex"), AramexAdapter)
        
        # Test future partner resolution
        adapter_bd = get_carrier_adapter("Blue Dart")
        self.assertEqual(adapter_bd.code, "bluedart")
        adapter_usps = get_carrier_adapter("USPS")
        self.assertEqual(adapter_usps.code, "usps")

    def test_02_minimal_admin_shipment_creation(self):
        """Test Admin creates a shipment with ONLY Partner Courier and Tracking Number."""
        payload = {
            "partner_courier": "FedEx",
            "partner_tracking_number": "874874634962"
        }
        res = create_shipment(payload)
        self.assertEqual(res.status_code, 201)
        import json
        body = json.loads(res.body.decode("utf-8"))
        data = body.get("data", {})
        self.assertEqual(data.get("partner_courier"), "FedEx")
        self.assertEqual(data.get("partner_tracking_number"), "874874634962")
        self.assertTrue(data.get("status"), "Shipment status should be auto-populated.")
        self.assertTrue(data.get("current_location"), "Location should be auto-populated.")

    def test_03_protected_fields_preservation(self):
        """Test that customer-protected fields are NEVER overwritten during carrier sync."""
        db = load_db()
        test_id = "874874634962"
        shipment = db.get("tracking", {}).get(test_id, {})
        
        # Set custom customer fields
        shipment["customer_name"] = "Sky Customer 100"
        shipment["phone"] = "+91 99999 88888"
        shipment["internal_notes"] = "VIP Account — Handled by Director"
        db.get("tracking", {})[test_id] = shipment
        save_db(db)

        # Trigger Force Sync
        synced = sync_shipment_tracking_data(shipment, force=True, triggered_by="Test Suite", db=db)

        self.assertEqual(synced.get("customer_name"), "Sky Customer 100")
        self.assertEqual(synced.get("phone"), "+91 99999 88888")
        self.assertEqual(synced.get("internal_notes"), "VIP Account — Handled by Director")

    def test_04_progress_bar_calculation(self):
        """Test dynamic progress bar percentage calculation."""
        self.assertEqual(calculate_progress_percent("Label Created"), 10)
        self.assertEqual(calculate_progress_percent("Picked Up"), 25)
        self.assertEqual(calculate_progress_percent("In Transit"), 50)
        self.assertEqual(calculate_progress_percent("Customs Clearance"), 75)
        self.assertEqual(calculate_progress_percent("Out for Delivery"), 90)
        self.assertEqual(calculate_progress_percent("Delivered"), 100)

    def test_05_public_customer_tracking(self):
        """Test public customer tracking endpoint returns structured data without external redirects."""
        res = get_public_tracking("874874634962")
        self.assertTrue(res.get("success"))
        data = res.get("data", {})
        self.assertEqual(data.get("partner_tracking_number"), "874874634962")
        self.assertTrue(data.get("status"))
        self.assertTrue("progress_percent" in data)

    def test_06_audit_logging(self):
        """Test that sync operations record audit logs."""
        res = get_admin_sync_logs()
        self.assertTrue(res.get("success"))
        logs = res.get("data", [])
        self.assertIsInstance(logs, list)
        self.assertTrue(len(logs) > 0, "Audit logs should record sync attempts.")

if __name__ == "__main__":
    unittest.main()
