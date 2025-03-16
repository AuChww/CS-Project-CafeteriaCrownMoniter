from flask import Blueprint, jsonify, request, send_from_directory
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import pytz
import time
from API.route.zoneVisitorHistoryRoute import (
    add_zone_visitor_history_endpoint
)


from Application.Service.feature.zoneService import (
    get_all_zones_service,
    get_zone_by_id_service,
    get_visitor_history_by_zone_id_service,
    get_restaurant_by_zone_id_service,
    get_all_report_by_zone_id_service,
    add_zone_service,
    update_zone_image,
    update_zone_service,
    update_zone_count_service,
    delete_zone_service
)

from Application.Service.feature.zoneVisitorHistoryService import (
    add_zone_visitor_history_service
)

from Application.objroi import get_zone_human_count
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import pytz 

zone_bp = Blueprint('zones', __name__)
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
            'zone_time': z.zone_time,
            'zone_image' : z.zone_image
        }
        for z in zones
    ]
    return jsonify({'zones': zone_list})

# def get_visitor_count(zone_id):
#     count = get_zone_human_count(zone_id)  
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
        'zone_time': zone.zone_time,
        'zone_image' : zone.zone_image
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
    data = request.form
    bar_id = data.get('bar_id')
    zone_name = data.get('zone_name')
    max_people_in_zone = data.get('max_people_in_zone')
    zone_detail = data.get('zone_detail')
    zone_time = data.get('zone_time', None) 
    zone_image = request.files.get('zone_image')
    current_visitor_count = 0

    zone_id = add_zone_service(bar_id, zone_name, zone_detail, max_people_in_zone, current_visitor_count, zone_time)  # Use the service function here
      
    if not zone_image:
        file_name = f'default.png'
    else :
        file_path = f'public/image/zoneImages/zone{zone_id}.png'
        file_name = f'zone{zone_id}.png'
        zone_image.save(file_path)
        print(f"Image saved to {file_path}")
        
    
    update_zone_image(zone_id, file_name) 
    
    return jsonify({'message': 'Zone added successfully', 'zone_id': zone_id, 'file_name': file_name}), 201

@zone_bp.route('/api/v1/updateZone/<int:zone_id>', methods=['PUT'])
def update_zone_endpoint(zone_id):
    data = request.json
    updated = update_zone_service(zone_id, data)  # Use the service function here
    if not updated:
        return jsonify({'message': 'Zone not found'}), 404

    return jsonify({'message': 'Zone updated successfully'})

# กำหนดโซนเวลาประเทศไทย
timezone = pytz.timezone("Asia/Bangkok")
utc_tz = pytz.utc



# zone_operating_hours = {
#     1: {"days": {0, 1, 2, 3, 4, 5, 6}, "start": "10:00", "end": "16:00"},  
#     2: {"days": {0, 1, 2, 3, 4, 5, 6}, "start": "11:00", "end": "16:00"},  
#     3: {"days": {0, 1, 2, 3, 4, 5}, "start": "12:00", "end": "16:00"},  
#     4: {"days": {0, 1, 2, 3, 4, 5, 6}, "start": "12:00", "end": "16:00"}, 
#     5: {"days": {0, 1, 2, 3, 4, 5}, "start": "13:00", "end": "16:00"}, 
#     6: {"days": {0, 1, 2, 3, 4, 5}, "start": "14:00", "end": "16:00"}, 
#     7: {"days": {0, 1, 2, 3, 4, 5}, "start": "10:00", "end": "16:00"}, 
#     8: {"days": {0, 1, 2, 3, 4, 5}, "start": "12:00", "end": "16:00"}, 
#     9: {"days": {0, 1, 2, 3, 4, 5}, "start": "10:00", "end": "16:00"}, 
#     10: {"days": {0, 1, 2, 3, 4, 5}, "start": "12:00", "end": "16:00"}, 
#     11: {"days": {0, 1, 2, 3, 4, 5}, "start": "12:00", "end": "16:00"}, 
#     12: {"days": {0, 1, 2, 3, 4, 5}, "start": "13:00", "end": "16:00"}, 
#     13: {"days": {0, 1, 2, 3, 4, 5}, "start": "13:00", "end": "16:00"}, 
#     14: {"days": {0, 1, 2, 3, 4, 5}, "start": "14:00", "end": "16:00"}, 
# }

def get_zone_operating_hours_func():
    zones = get_all_zones_service()

    zone_operating_hours = {
        z.zone_id: {
            "days": {0, 1, 2, 3, 4, 5, 6},  # กำหนดให้เปิดทุกวัน
            "start": z.zone_time.split(' - ')[0],  # แยกเวลาเริ่มต้นจาก zone_time
            "end": z.zone_time.split(' - ')[1]  # แยกเวลาปิดจาก zone_time
        }
        for z in zones
    }
    return zone_operating_hours



def is_zone_open(zone_id):
    now = datetime.now(timezone)
    current_day = now.weekday()  # 0 = จันทร์, 6 = อาทิตย์
    current_time = now.strftime("%H:%M")
    zone_operating_hours = get_zone_operating_hours_func()

    zone_info = zone_operating_hours.get(zone_id)
    
    print(f"zone_id: {zone_id} | zone_info: {zone_info}")
    if not zone_info:
        return False  # ถ้าไม่มีข้อมูลโซน ให้ปิด

    # ตรวจสอบว่าวันปัจจุบันอยู่ในช่วงเวลาที่กำหนดหรือไม่
    if current_day not in zone_info["days"]:
        return False

    # ตรวจสอบเวลา
    return zone_info["start"] <= current_time <= zone_info["end"]


@zone_bp.route('/api/v1/updateCatchCount/<int:zone_id>', methods=['PATCH'])
def update_catch_count():
    print(f"update_catch_count {datetime.now(timezone)}")
    zones = get_all_zones_service()

    if not zones:
        print(f"[{datetime.now(timezone)}] No zones found")
        return

    for zone in zones:
        if not is_zone_open(zone.zone_id):
            print(f"[{datetime.now(timezone)}] Zone {zone.zone_id} is closed. Skipping...")
            continue
        
        print(f"Zone is Open.")
        video_path = "zone"
        human_count = get_zone_human_count(zone.zone_id, video_path)
        print(f"{zone} count = {human_count}")

        if not isinstance(human_count, int):
            print(f"[{datetime.now}] Invalid human count for zone {zone.zone_id}")
            continue


        # เก็บค่า zone_id, human_count ไว้ใน cache
        visitor_counts_cache[zone.zone_id] = human_count
        update_date_time = datetime.now(pytz.utc).astimezone(timezone)
        update_date_time_str = update_date_time.strftime('%Y-%m-%d %H:%M:%S')

        # ยิง API ไปที่ update_zone_count ทุก 5 นาที
        update_zone_count_service(zone.zone_id, human_count, update_date_time_str)


        if update_date_time.minute == 0:
            # ถ้าใช่ ให้เรียก add_zone_visitor_history_service
            add_zone_visitor_history_service(update_date_time_str, zone.zone_id, human_count)
            print(f"This is Log : [{update_date_time_str}] Updated Zone {zone.zone_id} with count {human_count}")


        print(f"[{datetime.now(timezone)}] Updated Zone {zone.zone_id} with count {human_count}")
        print(f"-------------------------------------------------------------------------------------------------")
    return {"message": "Zone count updated"}

def start_scheduler():
    # ตั้งค่าไทม์โซนเป็นไทย
    tz = pytz.timezone('Asia/Bangkok')

    # เวลาปัจจุบันในไทม์โซนไทย
    now = datetime.now(tz)
    
    # คำนวณเวลาที่เหลือจนถึงชั่วโมงถัดไปที่ลงท้ายด้วย :00:00
    next_run = (now + timedelta(hours=1)).replace(minute=0, second=0, microsecond=0)
    delay = (next_run - now).total_seconds()

    # Debugging
    print(f"Current time: {now}")
    print(f"Next run at: {next_run}")
    print(f"Delay until next run: {delay} seconds")

    # สร้าง Scheduler
    scheduler = BackgroundScheduler(timezone=tz)

    update_catch_count()
    # save_zone_visitor_history()

    # เพิ่ม Job ที่จะเริ่มทำงานทันทีที่โปรแกรมเริ่ม และทำซ้ำทุกๆ 1 นาที
    scheduler.add_job(update_catch_count, "cron", minute="*/1", timezone=tz, start_date=now)

    # เพิ่ม Job ที่จะเริ่มทำงานทันทีที่โปรแกรมเริ่ม และทำซ้ำทุกๆ 1 ชั่วโมง
    # scheduler.add_job(save_zone_visitor_history, "cron", minute="*/1", timezone=tz, start_date=now)

    # เริ่ม Scheduler
    scheduler.start()

# เรียกใช้งาน Scheduler
start_scheduler()

@zone_bp.route('/api/v1/getZoneVideo/<string:file_name>', methods=['GET'])
def get_video_url(file_name):
    video_url = f"http://localhost:8000/videos/{file_name}"
    return jsonify({"url": video_url})

@zone_bp.route('/videos/<path:file_name>')
def serve_video(file_name):
    video_directory = os.path.join(os.getcwd(), "public", "video", "zone")
    return send_from_directory(video_directory, file_name)

IMAGE_FOLDER = 'public/image/zoneImages'

@zone_bp.route('/api/v1/getZoneImage/<string:file_name>', methods=['GET'])
def get_image_url(file_name):
    # สร้างเส้นทางเต็มของไฟล์
    file_path = os.path.join(IMAGE_FOLDER, file_name)

    # ตรวจสอบว่าไฟล์มีอยู่หรือไม่
    if not os.path.isfile(file_path):
        # ถ้าไม่พบไฟล์ให้ใช้ชื่อ default
        file_name = 'default.png'
    
    # สร้าง URL ที่จะส่งกลับ
    image_url = f"http://localhost:8000/public/image/zoneImages/{file_name}"

    return jsonify({"url": image_url})

@zone_bp.route('/public/image/zoneImages/<path:file_name>')
def serve_actual_image(file_name):
    image_directory = os.path.join(os.getcwd(), "public", "image", "zoneImages")
    return send_from_directory(image_directory, file_name)





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
#         # human_count = get_zone_human_count(zone.zone_id)  # ค่าที่ได้จะเป็น int เช่น 5, 3
#         human_count, _ = get_zone_human_count(zone.zone_id)

#         print(f"count = {human_count}")

#         # เพิ่ม log เพื่อตรวจสอบค่าที่ได้
#         print(f"Updating zone {zone.zone_id} with human count: {human_count}")

#         # ตรวจสอบว่า human_count เป็น int หรือไม่
#         if not isinstance(human_count, int):
#             return {"error": f"Invalid human count for zone {zone.zone_id}"}, 400

#         # อัปเดตข้อมูลจำนวนคนในโซน
#         zone.current_visitor_count = human_count  # อัปเดตค่าในข้อมูล
#         visitor_counts_cache[zone.zone_id] = human_count  # อัปเดตค่าในแคช

#         # บันทึกลงฐานข้อมูลผ่าน service
#         update_zone_count(zone.zone_id, human_count)  # ตรวจสอบว่า human_count เป็น int ที่ส่งไปที่นี่

#         print(f"Zone {zone.zone_name}: {human_count} human count")

#         # เก็บข้อมูลจำนวนคนในแต่ละโซน
#         updated_counts[zone.zone_id] = human_count

#     # ส่งคืน current_visitor_count ทั้งหมด
#     return {"updated_counts": updated_counts}, 200



@zone_bp.route('/api/v1/deleteZone/<int:zone_id>', methods=['DELETE'])
def delete_zone_endpoint(zone_id):
    deleted = delete_zone_service(zone_id)  # Use the service function here
    if not deleted:
        return jsonify({'message': 'Zone not found'}), 404

    return jsonify({'message': 'Zone deleted successfully'})

# if __name__ == '__main__':
#     zone_bp.run(debug=True)
