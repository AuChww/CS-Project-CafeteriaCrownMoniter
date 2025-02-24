# import unittest
# from unittest.mock import patch
# from datetime import datetime, timedelta
# import pytz

from zoneRoute import update_count_all_zones

update_count_all_zones()

# class TestGetHumanCount(unittest.TestCase):

#     @patch('zoneRoute.get_human_count')
#     def test_get_human_count(self, mock_get_human_count):
#         # Mock get_human_count function to return a fixed count
#         mock_get_human_count.return_value = 10
        
        
#         # Call the function
#         result = update_count_all_zones()
        
#         # Assert that the result matches the mocked value
#         self.assertEqual(result, 10)
        
#     # Add more test cases as needed
    
# if __name__ == '__main__':
#     unittest.main()

import unittest
from zoneRoute import update_count_all_zones  # เปลี่ยนเป็น import ตามโครงสร้างโปรเจกต์ของคุณ
from flask import Flask

class TestUpdateCountAllZones(unittest.TestCase):
    def setUp(self):
        # สร้าง app Flask สำหรับการทดสอบ route
        self.app = Flask(__name__)
        self.client = self.app.test_client()

    def test_update_count_all_zones(self):
        # ทดสอบการเรียกฟังก์ชัน updateCountAllZones
        with self.app.app_context():
            response = update_count_all_zones()

            # ตรวจสอบว่า response กลับมาเป็น dict และมี key 'updated_counts'
            self.assertIsInstance(response, tuple)  # Flask route คืนค่าเป็น tuple
            self.assertEqual(response[1], 200)  # ตรวจสอบ HTTP status code
            self.assertIn('updated_counts', response[0])  # ตรวจสอบว่า response มี 'updated_counts'
            self.assertIsInstance(response[0]['updated_counts'], dict)  # ตรวจสอบว่า updated_counts เป็น dictionary

if __name__ == '__main__':
    unittest.main()