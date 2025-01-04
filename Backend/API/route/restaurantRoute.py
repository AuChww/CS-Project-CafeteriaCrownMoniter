from flask import Blueprint, jsonify, request
from Application.Service.feature.restaurantService import get_restaurant_by_id_service, get_all_restaurants_service, get_all_reviews_by_restaurant_id_service, add_restaurant_service, update_restaurant_service, delete_restaurant_service

restaurant_bp = Blueprint('restaurants', __name__)

@restaurant_bp.route('/api/v1/getAllRestaurants', methods=['GET'])
def get_all_restaurants():
    restaurants = get_all_restaurants_service()
    restaurant_list = [
        {
            'restaurant_id': r.restaurant_id,
            'bar_id': r.bar_id,
            'restaurant_name': r.restaurant_name,
            'restaurant_location': r.restaurant_location,
            'restaurant_detail': r.restaurant_detail,
            'total_rating': r.total_rating,
            'total_reviews': r.total_reviews,
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
        'bar_id': restaurant.bar_id,
        'restaurant_name': restaurant.restaurant_name,
        'restaurant_location': restaurant.restaurant_location,
        'restaurant_detail': restaurant.restaurant_detail,
        'total_rating': restaurant.total_rating,
        'total_reviews': restaurant.total_reviews,
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
            'comment': r.comment,
            'created_at': r.created_at
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
