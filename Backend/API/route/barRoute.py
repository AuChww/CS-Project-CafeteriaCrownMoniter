from flask import Blueprint, jsonify, request, send_from_directory
from Application.Service.feature.barService import update_bar_visitors,get_all_bars_service, get_bar_by_id_service, get_all_restaurants_by_bar_id_service, get_all_reviews_by_bar_id_service, get_all_zones_by_bar_id_service, add_bar_service, update_bar_service, delete_bar_service

import os
bar_bp = Blueprint('bars', __name__)

@bar_bp.route('/update_bar_visitors/<int:bar_id>', methods=['POST'])
def update_bar_visitors(bar_id):
    total_visitors = update_bar_visitors(bar_id)
    return jsonify({
        "bar_id": bar_id,
        "updated_current_visitor_count": total_visitors
    }), 200

@bar_bp.route('/api/v1/getAllBars', methods=['GET'])
def get_all_bars():
    bars = get_all_bars_service()
    bars_list = [
        {
            'bar_id': bar.bar_id,
            'bar_name': bar.bar_name,
            'bar_location': bar.bar_location,
            'bar_detail': bar.bar_detail,
            'current_visitor_count': bar.current_visitor_count,
            'max_people_in_bar': bar.max_people_in_bar,
            'total_rating': bar.total_rating,
            'total_reviews': bar.total_reviews,
            'bar_image': bar.bar_image  # เพิ่ม bar_image ในการตอบกลับ
        }
        for bar in bars
    ]
    return jsonify({'bars': bars_list})

@bar_bp.route('/api/v1/getBarId/<int:bar_id>', methods=['GET'])
def get_bar_by_id(bar_id):
    bar = get_bar_by_id_service(bar_id)
    if not bar:
        return jsonify({'message': 'Bar not found'}), 404

    return jsonify({
        'bar_id': bar.bar_id,
        'bar_name': bar.bar_name,
        'bar_location': bar.bar_location,
        'bar_detail': bar.bar_detail,
        'current_visitor_count' : bar.current_visitor_count,
        'max_people_in_bar': bar.max_people_in_bar,
        'total_rating': bar.total_rating,
        'total_reviews': bar.total_reviews,
        'bar_image': bar.bar_image  # เพิ่ม bar_image ในการตอบกลับ
    })

@bar_bp.route('/api/v1/getRestaurantByBarId/<int:bar_id>', methods=['GET'])
def get_all_restaurants_by_bar_id(bar_id):
    restaurants = get_all_restaurants_by_bar_id_service(bar_id)
    restaurant_list = [
        {
            'restaurant_id': r.restaurant_id,
            'zone_id': r.zone_id,
            'restaurant_name': r.restaurant_name,
            'restaurant_location': r.restaurant_location,
            'restaurant_detail': r.restaurant_detail,
            'total_rating': r.total_rating,
            'total_reviews': r.total_reviews,
            'restaurant_image': r.restaurant_image
        }
        for r in restaurants
    ]
    return jsonify({'restaurants': restaurant_list})

@bar_bp.route('/api/v1/getAllReviewByBarId/<int:bar_id>', methods=['GET'])
def get_all_reviews_by_bar_id(bar_id):
    reviews = get_all_reviews_by_bar_id_service(bar_id)
    review_list = [
        {
            'review_id': r.review_id,
            'user_id': r.user_id,
            'restaurant_id': r.restaurant_id,
            'rating': r.rating,
            'comment': r.review_comment,
            'created_time': r.created_time,
            'update_time': r.update_time,
            'review_image': r.review_image  # เพิ่มฟิลด์ review_image
        }
        for r in reviews
    ]
    return jsonify({'reviews': review_list})

@bar_bp.route('/api/v1/getAllZonesByBarId/<int:bar_id>', methods=['GET'])
def get_all_zones_by_bar_id(bar_id):
    zones = get_all_zones_by_bar_id_service(bar_id)
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


@bar_bp.route('/api/v1/addBar', methods=['POST'])
def add_bar():
    data = request.json
    bar_name = data.get('bar_name')
    bar_location = data.get('bar_location')
    bar_detail = data.get('bar_detail')
    bar_image = data.get('bar_image')  # รับ bar_image จาก request

    if not all([bar_name, bar_location]):
        return jsonify({'message': 'Missing required fields'}), 400

    bar_id = add_bar_service(bar_name, bar_location, bar_detail, bar_image)  # ส่ง bar_image ไปยัง service
    return jsonify({'message': 'Bar added successfully', 'bar_id': bar_id}), 201

@bar_bp.route('/api/v1/updateBar/<int:bar_id>', methods=['PUT'])
def update_bar(bar_id):
    data = request.json
    updated = update_bar_service(bar_id, data)  # ส่งข้อมูลทั้งหมดยัง service
    if not updated:
        return jsonify({'message': 'Bar not found'}), 404

    return jsonify({'message': 'Bar updated successfully'})

@bar_bp.route('/api/v1/deleteBar/<int:bar_id>', methods=['DELETE'])
def delete_bar(bar_id):
    deleted = delete_bar_service(bar_id)
    if not deleted:
        return jsonify({'message': 'Bar not found'}), 404

    return jsonify({'message': 'Bar deleted successfully'})


# @bar_bp.route('/api/v1/getBarVideo/<string:file_name>', methods=['GET'])
# def get_video_url(file_name):
#     video_url = f"http://localhost:8000/videos/{file_name}"
#     return jsonify({"url": video_url})

# @bar_bp.route('/videos/<path:file_name>')
# def serve_video(file_name):
#     video_directory = os.path.join(os.getcwd(), "public", "video", "zone")
#     return send_from_directory(video_directory, file_name)

IMAGE_FOLDER = 'public/image/barImages'

@bar_bp.route('/api/v1/getBarImage/<string:file_name>', methods=['GET'])
def get_image_url(file_name):
    # สร้างเส้นทางเต็มของไฟล์
    file_path = os.path.join(IMAGE_FOLDER, file_name)

    # ตรวจสอบว่าไฟล์มีอยู่หรือไม่
    if not os.path.isfile(file_path):
        # ถ้าไม่พบไฟล์ให้ใช้ชื่อ default
        file_name = 'default.png'
    
    # สร้าง URL ที่จะส่งกลับ
    image_url = f"http://localhost:8000/public/image/barImages/{file_name}"

    return jsonify({"url": image_url})

@bar_bp.route('/public/image/barImages/<path:file_name>')
def serve_actual_image(file_name):
    image_directory = os.path.join(os.getcwd(), "public", "image", "barImages")
    return send_from_directory(image_directory, file_name)




