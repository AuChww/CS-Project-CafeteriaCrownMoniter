from flask import Blueprint, jsonify, request
from Application.Service.feature.visitorHistoryService import (
    get_all_visitor_histories_service,
    get_visitor_history_by_zone_id_service,
    add_visitor_history_service,
    update_visitor_history_service,
    delete_visitor_history_service,
    get_all_zones_service
)

from Application.objroi import get_human_count
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import requests
import pytz  # สำหรับจัดการไทม์โซน

visitor_history_bp = Blueprint('visitor_history', __name__)

@visitor_history_bp.route('/api/v1/getAllVisitorHistories', methods=['GET'])
def get_all_visitor_histories_endpoint():
    visitor_histories = get_all_visitor_histories_service()
    visitor_histories_dicts = [
        {
            'visitor_history_id': vh.visitor_history_id,
            'date_time': vh.date_time,
            'zone_id': vh.zone_id,
            'visitor_count': vh.visitor_count
        }
        for vh in visitor_histories
    ]
    return jsonify({'visitor_histories': visitor_histories_dicts})


# @visitor_history_bp.route('/api/v1/getVisitorHistoryByZoneId/<int:zone_id>', methods=['GET'])
# def get_visitor_history_by_zone_id_endpoint(zone_id):
#     visitor_histories = get_visitor_history_by_zone_id_service(zone_id)
#     if not visitor_histories:
#         return jsonify({'message': 'No visitor history found for the given zone ID'}), 404
#     return jsonify([
#         {
#             'date_time': history.date_time,
#             'zone_id': history.zone_id,
#             'visitor_count': history.visitor_count
#         }
#         for history in visitor_histories
#     ])

def post_visitor_history():
    
    all_human_counts = get_human_count()
    
    total_visitor_count = sum(all_human_counts) 
    
    # Get a list of all zone_ids
    zone_ids = get_all_zones_service()

    # Debugging: Ensure the output is as expected
    print(f"Zone IDs: {zone_ids}")

    # Use timezone-aware datetime
    tz = pytz.timezone('Asia/Bangkok')
    now = datetime.now(tz)

    # Format the datetime correctly as 'YYYY-MM-DD HH:MM:SS'
    formatted_time = now.strftime('%Y-%m-%d %H:%M:%S')
    

    for zone_id in zone_ids:
        # Define the payload for the request with the formatted, timezone-aware date_time
        data = {
            'date_time': formatted_time,
            'zone_id': zone_id,  # zone_id is now an integer
            'visitor_count': 60
        }

        # Post the data to your endpoint
        response = requests.post('http://localhost:8000/api/v1/addVisitorHistory', json=data)

        if response.status_code == 201:
            print(f"Visitor history added for zone_id {zone_id}")
        else:
            print(f"Failed to add visitor history for zone_id {zone_id}, Status: {response.status_code}")


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

    # เพิ่ม Job ที่จะเริ่มในเวลาที่คำนวณได้ และทำซ้ำทุกๆ 1 ชั่วโมง
    scheduler.add_job(post_visitor_history, 'interval', hours=1, next_run_time=next_run)

    # เริ่ม Scheduler
    scheduler.start()

# เรียกใช้งาน Scheduler
start_scheduler()

@visitor_history_bp.route('/api/v1/addVisitorHistory', methods=['POST'])
def add_visitor_history_endpoint():
    data = request.json
    date_time = data.get('date_time')
    zone_id = data.get('zone_id')
    visitor_count = data.get('visitor_count')

    if not date_time or not zone_id or visitor_count is None:
        return jsonify({'message': 'Missing required fields'}), 400

    visitor_history_id = add_visitor_history_service(date_time, zone_id, visitor_count)
    return jsonify({'message': 'Visitor history added successfully', 'visitor_history_id': visitor_history_id}), 201

# @visitor_history_bp.route('/api/v1/addVisitorHistory', methods=['POST'])
# def add_visitor_history_endpoint():
#     data = request.json
#     date_time = data.get('date_time')
#     zone_id = data.get('zone_id')
#     visitor_count = data.get('visitor_count')

#     if not date_time or not zone_id or visitor_count is None:
#         return jsonify({'message': 'Missing required fields'}), 400

#     visitor_history_id = add_visitor_history_service(date_time, zone_id, visitor_count)
#     return jsonify({'message': 'Visitor history added successfully', 'visitor_history_id': visitor_history_id}), 201

@visitor_history_bp.route('/api/v1/updateVisitorHistory/<int:visitor_history_id>', methods=['PUT'])
def update_visitor_history_endpoint(visitor_history_id):
    data = request.json
    updated = update_visitor_history_service(visitor_history_id, data)
    if not updated:
        return jsonify({'message': 'Visitor history not found'}), 404
    return jsonify({'message': 'Visitor history updated successfully'})

@visitor_history_bp.route('/api/v1/deleteVisitorHistory/<int:visitor_history_id>', methods=['DELETE'])
def delete_visitor_history_endpoint(visitor_history_id):
    deleted = delete_visitor_history_service(visitor_history_id)
    if not deleted:
        return jsonify({'message': 'Visitor history not found'}), 404
    return jsonify({'message': 'Visitor history deleted successfully'})
