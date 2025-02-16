from flask import Blueprint, jsonify, request
from Application.Service.feature.restaurantVisitorHistoryService import (
    get_all_restaurant_visitor_histories_service,
    get_visitor_history_by_restaurant_id_service,
    add_restaurant_visitor_history_service,
    update_restaurant_visitor_history_service,
    delete_restaurant_visitor_history_service,
    get_all_restaurants_service
)
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import requests
import pytz  # สำหรับจัดการไทม์โซน

restaurant_visitor_history_bp = Blueprint('restaurant_visitor_history', __name__)

@restaurant_visitor_history_bp.route('/api/v1/getAllVisitorHistories', methods=['GET'])
def get_all_restaurant_visitor_histories_endpoint():
    visitor_histories = get_all_restaurant_visitor_histories_service()
    visitor_histories_dicts = [
        {
            'restaurant_visitor_history_id': vh.restaurant_visitor_history_id,
            'date_time': vh.date_time,
            'restaurant_id': vh.restaurant_id,
            'visitor_count': vh.visitor_count
        }
        for vh in visitor_histories
    ]
    return jsonify({'visitor_histories': visitor_histories_dicts})


# @restaurant_visitor_history_bp.route('/api/v1/getVisitorHistoryByrestaurantId/<int:restaurant_id>', methods=['GET'])
# def get_visitor_history_by_restaurant_id_endpoint(restaurant_id):
#     visitor_histories = get_visitor_history_by_restaurant_id_service(restaurant_id)
#     if not visitor_histories:
#         return jsonify({'message': 'No visitor history found for the given restaurant ID'}), 404
#     return jsonify([
#         {
#             'date_time': history.date_time,
#             'restaurant_id': history.restaurant_id,
#             'visitor_count': history.visitor_count
#         }
#         for history in visitor_histories
#     ])

def post_restaurant_visitor_history():
    # Get a list of all restaurant_ids
    restaurant_ids = get_all_restaurants_service()

    # Debugging: Ensure the output is as expected
    print(f"restaurant IDs: {restaurant_ids}")

    # Use timerestaurant-aware datetime
    tz = pytz.timezone('Asia/Bangkok')
    now = datetime.now(tz)

    # Format the datetime correctly as 'YYYY-MM-DD HH:MM:SS'
    formatted_time = now.strftime('%Y-%m-%d %H:%M:%S')

    for restaurant_id in restaurant_ids:
        # Define the payload for the request with the formatted, timerestaurant-aware date_time
        data = {
            'date_time': formatted_time,
            'restaurant_id': restaurant_id,  # restaurant_id is now an integer
            'visitor_count': 60
        }

        # Post the data to your endpoint
        response = requests.post('http://localhost:8000/api/v1/addVisitorHistory', json=data)

        if response.status_code == 201:
            print(f"Visitor history added for restaurant_id {restaurant_id}")
        else:
            print(f"Failed to add visitor history for restaurant_id {restaurant_id}, Status: {response.status_code}")


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
    scheduler = BackgroundScheduler(timerestaurant=tz)

    # เพิ่ม Job ที่จะเริ่มในเวลาที่คำนวณได้ และทำซ้ำทุกๆ 1 ชั่วโมง
    scheduler.add_job(post_restaurant_visitor_history, 'interval', hours=1, next_run_time=next_run)

    # เริ่ม Scheduler
    scheduler.start()

# เรียกใช้งาน Scheduler
start_scheduler()

@restaurant_visitor_history_bp.route('/api/v1/addVisitorHistory', methods=['POST'])
def add_restaurant_visitor_history_endpoint():
    data = request.json
    date_time = data.get('date_time')
    restaurant_id = data.get('restaurant_id')
    visitor_count = data.get('visitor_count')

    if not date_time or not restaurant_id or visitor_count is None:
        return jsonify({'message': 'Missing required fields'}), 400

    restaurant_visitor_history_id = add_restaurant_visitor_history_service(date_time, restaurant_id, visitor_count)
    return jsonify({'message': 'Visitor history added successfully', 'restaurant_visitor_history_id': restaurant_visitor_history_id}), 201

# @restaurant_visitor_history_bp.route('/api/v1/addVisitorHistory', methods=['POST'])
# def add_visitor_history_endpoint():
#     data = request.json
#     date_time = data.get('date_time')
#     restaurant_id = data.get('restaurant_id')
#     visitor_count = data.get('visitor_count')

#     if not date_time or not restaurant_id or visitor_count is None:
#         return jsonify({'message': 'Missing required fields'}), 400

#     visitor_history_id = add_visitor_history_service(date_time, restaurant_id, visitor_count)
#     return jsonify({'message': 'Visitor history added successfully', 'visitor_history_id': visitor_history_id}), 201

@restaurant_visitor_history_bp.route('/api/v1/updateVisitorHistory/<int:restaurant_visitor_history_id>', methods=['PUT'])
def update_restaurant_visitor_history_endpoint(restaurant_visitor_history_id):
    data = request.json
    updated = update_restaurant_visitor_history_service(restaurant_visitor_history_id, data)
    if not updated:
        return jsonify({'message': 'Visitor history not found'}), 404
    return jsonify({'message': 'Visitor history updated successfully'})

@restaurant_visitor_history_bp.route('/api/v1/deleteVisitorHistory/<int:restaurant_visitor_history_id>', methods=['DELETE'])
def delete_restaurant_visitor_history_endpoint(restaurant_visitor_history_id):
    deleted = delete_restaurant_visitor_history_service(restaurant_visitor_history_id)
    if not deleted:
        return jsonify({'message': 'Visitor history not found'}), 404
    return jsonify({'message': 'Visitor history deleted successfully'})
