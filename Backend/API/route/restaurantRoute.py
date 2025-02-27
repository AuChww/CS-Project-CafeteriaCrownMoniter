from flask import Blueprint, jsonify, request
from Application.Service.feature.restaurantService import (
     get_restaurant_by_id_service,
     get_all_restaurants_service,
     get_all_reviews_by_restaurant_id_service,
     add_restaurant_service,
     update_restaurant_service,
     update_restaurant_count_service,
     delete_restaurant_service
)
from Application.objroi import get_human_count
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import pytz 
from apscheduler.triggers.cron import CronTrigger
import atexit

restaurant_bp = Blueprint('restaurants', __name__)

@restaurant_bp.route('/api/v1/getAllRestaurants', methods=['GET'])
def get_all_restaurants():
    restaurants = get_all_restaurants_service()
    restaurant_list = [
        {
            'restaurant_id': r.restaurant_id,
            'zone_id': r.zone_id,
            'restaurant_name': r.restaurant_name,
            'restaurant_location': r.restaurant_location,
            'restaurant_detail': r.restaurant_detail,
            'total_rating': r.total_rating,
            'total_reviews': r.total_reviews,
            'current_visitor_count': r.current_visitor_count,
            'restaurant_image': r.restaurant_image  # เพิ่ม restaurant_image ในการตอบกลับ
        }
        for r in restaurants
    ]
    return jsonify({'restaurants': restaurant_list})

@restaurant_bp.route('/api/v1/getRestaurantId/<int:restaurant_id>', methods=['GET'])
def get_restaurant_by_id(restaurant_id):
    restaurant = get_restaurant_by_id_service(restaurant_id)
    if not restaurant:
        return jsonify({'message': 'Restaurant not found'}), 404

    return jsonify({
        'restaurant_id': restaurant.restaurant_id,
        'zone_id': restaurant.zone_id,
        'restaurant_name': restaurant.restaurant_name,
        'restaurant_location': restaurant.restaurant_location,
        'restaurant_detail': restaurant.restaurant_detail,
        'total_rating': restaurant.total_rating,
        'total_reviews': restaurant.total_reviews,
        'current_visitor_count': restaurant.current_visitor_count,
        'restaurant_image': restaurant.restaurant_image  # เพิ่ม restaurant_image ในการตอบกลับ
    })

@restaurant_bp.route('/api/v1/getReviewByRestaurantId/<int:restaurant_id>', methods=['GET'])
def get_all_reviews_by_restaurant_id(restaurant_id):
    reviews = get_all_reviews_by_restaurant_id_service(restaurant_id)
    review_list = [
        {
            'review_id': r.review_id,
            'user_id': r.user_id,
            'restaurant_id': r.restaurant_id,
            'rating': r.rating,
            'review_comment': r.review_comment,
            'created_time': r.created_time,
            'update_time': r.update_time,
            'review_image': r.review_image 
        }
        for r in reviews
    ]
    return jsonify({'reviews': review_list})

@restaurant_bp.route('/api/v1/addRestaurant', methods=['POST'])
def add_restaurant():
    data = request.json
    bar_id = data.get('bar_id')
    restaurant_name = data.get('restaurant_name')
    restaurant_location = data.get('restaurant_location')
    restaurant_detail = data.get('restaurant_detail')
    restaurant_image = data.get('restaurant_image')  # รับ restaurant_image จาก request

    if not all([bar_id, restaurant_name, restaurant_location]):
        return jsonify({'message': 'Missing required fields'}), 400

    restaurant_id = add_restaurant_service(bar_id, restaurant_name, restaurant_location, restaurant_detail, restaurant_image)  # ส่ง restaurant_image ไปยัง service
    return jsonify({'message': 'Restaurant added successfully', 'restaurant_id': restaurant_id}), 201



timezone = pytz.timezone('Asia/Bangkok')

@restaurant_bp.route('/api/v1/updateCountAllRestaurants', methods=['PATCH'])
def update_count_all_restaurants():
    print(f"Running scheduled task: update_count_all_restaurants | Time: {timezone}")
    restaurants = get_all_restaurants_service()

    if not restaurants:
        print("No restaurants found")
        return


    for restaurant in restaurants:
        human_count = get_human_count(restaurant.restaurant_id)

        if not isinstance(human_count, int):
            print(f"Invalid human count for restaurant: {restaurant.restaurant_id}")
            continue  # ข้ามโซนนั้นถ้ามีปัญหา

        update_restaurant_count_service(restaurant.restaurant_id, human_count)
        # updated_counts[restaurant.restaurant_id] = human_count
        print(f"Updated restaurant {restaurant.restaurant_id}: {human_count} human count")

    print(f"Update Human count Amount: {human_count} | Restaurant: {restaurant.restaurant_id}")

@restaurant_bp.route('/api/v1/updateRestaurant/<int:restaurant_id>', methods=['PUT'])
def update_restaurant(restaurant_id):
    data = request.json
    updated = update_restaurant_service(restaurant_id, data)  # ส่งข้อมูลทั้งหมดยัง service
    if not updated:
        return jsonify({'message': 'Restaurant not found'}), 404

    return jsonify({'message': 'Restaurant updated successfully'})

@restaurant_bp.route('/api/v1/deleteRestaurant/<int:restaurant_id>', methods=['DELETE'])
def delete_restaurant(restaurant_id):
    deleted = delete_restaurant_service(restaurant_id)
    if not deleted:
        return jsonify({'message': 'Restaurant not found'}), 404

    return jsonify({'message': 'Restaurant deleted successfully'})
