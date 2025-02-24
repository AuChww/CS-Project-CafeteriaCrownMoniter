# import unittest
# from unittest.mock import patch
# from datetime import datetime, timedelta
# import pytz

# import unittest
# from unittest.mock import patch, MagicMock
# from flask import Flask
from zoneRoute import update_count_all_zones
# class TestUpdateCountAllZones(unittest.TestCase):

#     def setUp(self):
#         """สร้าง Flask test client และ context"""
#         self.app = Flask(__name__)
#         self.client = self.app.test_client()
#         self.ctx = self.app.app_context()
#         self.ctx.push()

#     def tearDown(self):
#         """ปิด Flask context"""
#         self.ctx.pop()

#     @patch('zoneRoute.get_all_zones_service')
#     @patch('zoneRoute.get_human_count', return_value=10)
#     @patch('zoneRoute.get_all_report_by_zone_id_endpoint')
#     @patch('zoneRoute.update_zone_count')
#     @patch('zoneRoute.visitor_counts_cache', new_callable=dict)
#     def test_update_count_all_zones(
#         self, mock_cache, mock_update_zone, mock_get_report, mock_get_human, mock_get_zones
#     ):
#         """ทดสอบการอัปเดตค่าคนในแต่ละโซน"""
#         mock_get_zones.return_value = [MagicMock(zone_id=1), MagicMock(zone_id=2)]

#         response = update_count_all_zones()
        
#         self.assertEqual(response[1], 200)  
#         self.assertEqual(response[0]["updated_counts"], {1: 10, 2: 10})

# if __name__ == '__main__':
#     unittest.main()
