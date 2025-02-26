from flask import Blueprint, jsonify, request, Flask
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from Application.Service.feature.zoneService import (
    get_all_zones_service,
    get_zone_by_id_service,
    get_visitor_history_by_zone_id_service,
    get_restaurant_by_zone_id_service,
    get_all_report_by_zone_id_service,
    add_zone_service,
    update_zone_service,
    update_zone_count_service,
    delete_zone_service
)

from Application.objroi import get_human_count
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import pytz 
from apscheduler.triggers.cron import CronTrigger
import atexit

app = Flask(__name__)
zone_bp = Blueprint('zones_bp', __name__)
visitor_counts_cache = {}

@zone_bp.route('/api/v1/getAllZones', methods=['GET'])
def get_all_zones_endpoint():
    zones = get_all_zones_service()  # Use the service function here
    zone_list = [
        {
            'zone_id': z.zone_id,
            'bar_id': z.bar_id,
            'zone_name': z.zone_name,
            'zone_detail': z.zone_detail,
            'max_people_in_zone': z.max_people_in_zone,
            'current_visitor_count': z.current_visitor_count,
            'update_date_time': z.update_date_time,
            'zone_time': z.zone_time
        }
        for z in zones
    ]
    return jsonify({'zones': zone_list})

# def get_visitor_count(zone_id):
#     count = get_human_count(zone_id)  
#     visitor_counts_cache[zone_id] = count
    
#     print("test count in zoneroute",count)
#     return count

# def objroi_scheduler():
#     tz = pytz.timezone('Asia/Bangkok')
#     scheduler = BackgroundScheduler(timezone=tz)
    
#     # ดึงค่าคนทุกๆ 10 นาที
#     scheduler.add_job(update_visitor_counts, 'interval', minutes=10)
    
#     scheduler.start()

@zone_bp.route('/api/v1/getZoneById/<int:zone_id>', methods=['GET'])
def get_zone_by_id_endpoint(zone_id):
    zone = get_zone_by_id_service(zone_id)  # Use the service function here
    if not zone:
        return jsonify({'message': 'Zone not found'}), 404
    

    return jsonify({
        'zone_id': zone.zone_id,
        'bar_id': zone.bar_id,
        'zone_name': zone.zone_name,
        'zone_detail': zone.zone_detail,
        'max_people_in_zone': zone.max_people_in_zone,
        'current_visitor_count': zone.current_visitor_count,
        'update_date_time': zone.update_date_time,
        'zone_time': zone.zone_time
    })

@zone_bp.route('/api/v1/getVisitorHistoryByZoneId/<int:zone_id>', methods=['GET'])
def get_visitor_history_by_zone_id_endpoint(zone_id):
    visitor_histories = get_visitor_history_by_zone_id_service(zone_id)
    if not visitor_histories:
        return jsonify({'message': 'No visitor history found for the given zone ID'}), 404
    return jsonify([
        {
            'date_time': history.date_time,
            'zone_id': history.zone_id,
            'visitor_count': history.visitor_count
        }
        for history in visitor_histories
    ])

@zone_bp.route('/api/v1/getRestaurantByZoneId/<int:zone_id>', methods=['GET'])
def get_restaurant_by_zone_id_endpoint(zone_id):
    restaurants = get_restaurant_by_zone_id_service(zone_id)  # Use the service function here
    if not restaurants:
        return jsonify({'message': 'No restaurants found for this zone'}), 404

    return jsonify({'restaurants': restaurants})

@zone_bp.route('/api/v1/getAllReportByZoneId/<int:zone_id>', methods=['GET'])
def get_all_report_by_zone_id_endpoint(zone_id):
    reports = get_all_report_by_zone_id_service(zone_id)  # Use the service function here
    if not reports:
        return jsonify({'message': 'No reports found for this zone'}), 404

    return jsonify({'reports': reports})

@zone_bp.route('/api/v1/addZone', methods=['POST'])
def add_zone_endpoint():
    data = request.json
    bar_id = data.get('bar_id')
    zone_name = data.get('zone_name')
    zone_detail = data.get('zone_detail', '')
    max_people_in_zone = data.get('max_people_in_zone', 0)
    current_visitor_count = data.get('current_visitor_count', 0)
    zone_time = data.get('zone_time', None)

    if not bar_id or not zone_name:
        return jsonify({'message': 'Missing required fields'}), 400

    zone_id = add_zone_service(bar_id, zone_name, zone_detail, max_people_in_zone, current_visitor_count, zone_time)  # Use the service function here
    return jsonify({'message': 'Zone added successfully', 'zone_id': zone_id}), 201

@zone_bp.route('/api/v1/updateZone/<int:zone_id>', methods=['PUT'])
def update_zone_endpoint(zone_id):
    data = request.json
    updated = update_zone_service(zone_id, data)  # Use the service function here
    if not updated:
        return jsonify({'message': 'Zone not found'}), 404

    return jsonify({'message': 'Zone updated successfully'})


def update_visitor_counts():
    
    zones = get_all_zones_service()  # ดึงรายการโซนทั้งหมด
    for zone in zones:
        count = get_human_count(zone.zone_id)  # ดึงค่าจำนวนคนของแต่ละโซน
        visitor_counts_cache[zone.zone_id] = count  # อัปเดตค่าในแคช
        get_all_report_by_zone_id_endpoint(zone.zone_id)
        print(f"zone {zone.zone_id}: {count} human count")


# @zone_bp.route('/api/v1/updateCountAllZones', methods=['PATCH'])
# def update_count_all_zones():
#     # ดึงข้อมูลทุกโซน
#     zones = get_all_zones_service()  

#     # ตรวจสอบว่า zones มีข้อมูลหรือไม่
#     if not zones:
#         return {"error": "No zones found"}, 400

#     # สร้าง dictionary เพื่อเก็บจำนวนคนในแต่ละโซน
#     updated_counts = {}

#     # วนลูปอัปเดตข้อมูล
#     for zone in zones:
#         # ดึงจำนวนคนจากแต่ละโซน
#         print(f"before human count")
#         print(f"{zone.zone_id}")
#         human_count = get_human_count(zone.zone_id)  # ค่าที่ได้จะเป็น int เช่น 5, 3
#         print(f"count = {human_count}")

#         # เพิ่ม log เพื่อตรวจสอบค่าที่ได้
#         print(f"Updating zone {zone.zone_id} with human count: {human_count}")

#         # ตรวจสอบว่า human_count เป็น int หรือไม่
#         if not isinstance(human_count, int):
#             return {"error": f"Invalid human count for zone {zone.zone_id}"}, 400
        
#         if type(zone.zone_id) == int:
#             print("zone_id เป็น int")
#         else:
#             print("zone_id ไม่ใช่ int")


#         # อัปเดตข้อมูลจำนวนคนในโซน
#         zone.current_visitor_count = human_count  # อัปเดตค่าในข้อมูล
        
#         # visitor_counts_cache[zone.zone_id] = human_count  # อัปเดตค่าในแคช
        

#         # บันทึกลงฐานข้อมูลผ่าน service
#         update_zone_count_service(zone.zone_id, human_count)  # ตรวจสอบว่า human_count เป็น int ที่ส่งไปที่นี่

#         print(f"Zone {zone.zone_name}: {human_count} human count")

#         # เก็บข้อมูลจำนวนคนในแต่ละโซน
#         updated_counts[zone.zone_id] = human_count

#     # ส่งคืน current_visitor_count ทั้งหมด
#     return {"updated_counts": updated_counts}, 200

timezone = pytz.timezone('Asia/Bangkok')

@zone_bp.route('/api/v1/updateCountAllZones', methods=['PATCH'])
def update_count_all_zones():
    print(f"Running scheduled task: update_count_all_zones | Time: {timezone}")
    zones = get_all_zones_service()

    if not zones:
        print("No zones found")
        return

    # updated_counts = {}

    for zone in zones:
        human_count = get_human_count(zone.zone_id)

        if not isinstance(human_count, int):
            print(f"Invalid human count for zone {zone.zone_id}")
            continue  # ข้ามโซนนั้นถ้ามีปัญหา

        update_zone_count_service(zone.zone_id, human_count)
        # updated_counts[zone.zone_id] = human_count
        print(f"Updated Zone {zone.zone_id}: {human_count} human count")

    print(f"Update Human count Amount: {human_count} | Zone: {zone.zone_id}")

# ตั้งค่า Scheduler และ CronTrigger ให้รันทุก 10 นาที ตามเวลาไทย
scheduler = BackgroundScheduler(timezone=timezone)
scheduler.add_job(update_count_all_zones, CronTrigger(minute='0,10,20,30,40,50', timezone=timezone))  
scheduler.start()

# ปิด Scheduler อย่างปลอดภัยเมื่อแอปปิดตัว
atexit.register(lambda: scheduler.shutdown())

if __name__ == "__main__":
    app.run(debug=True)

@zone_bp.route('/api/v1/deleteZone/<int:zone_id>', methods=['DELETE'])
def delete_zone_endpoint(zone_id):
    deleted = delete_zone_service(zone_id)  # Use the service function here
    if not deleted:
        return jsonify({'message': 'Zone not found'}), 404

    return jsonify({'message': 'Zone deleted successfully'})
