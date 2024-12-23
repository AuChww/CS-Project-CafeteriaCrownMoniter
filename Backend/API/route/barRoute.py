from flask import Blueprint, jsonify, request
from Application.Service.feature.barService import get_all_bars_service,get_bar_by_id_service,get_all_restaurants_by_bar_id_service,get_all_reviews_by_bar_id_service,add_bar_service, update_bar_service, delete_bar_service

bar_bp = Blueprint('bars', __name__)

@bar_bp.route('/api/v1/getAllBars', methods=['GET'])
def get_all_bars():
    bars = get_all_bars_service()
    bars_list = [
        {
            'bar_id': bar.bar_id,
            'bar_name': bar.bar_name,
            'bar_location': bar.bar_location,
            'bar_detail': bar.bar_detail,
            'total_rating': bar.total_rating,
            'total_reviews': bar.total_reviews,
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
        'total_rating': bar.total_rating,
        'total_reviews': bar.total_reviews
    })

@bar_bp.route('/api/v1/getRestaurantByBarId/<int:bar_id>', methods=['GET'])
def get_all_restaurants_by_bar_id(bar_id):
    restaurants = get_all_restaurants_by_bar_id_service(bar_id)
    restaurant_list = [
        {
            'restaurant_id': r.restaurant_id,
            'bar_id': r.bar_id,
            'restaurant_name': r.restaurant_name,
            'restaurant_location': r.restaurant_location,
            'restaurant_detail': r.restaurant_detail,
            'total_rating': r.total_rating,
            'total_reviews': r.total_reviews
        }
        for r in restaurants
    ]
    return jsonify({'restaurants': restaurant_list})

@bar_bp.route('/api/v1/getReviewByBarId/<int:bar_id>', methods=['GET'])
def get_all_reviews_by_bar_id(bar_id):
    reviews = get_all_reviews_by_bar_id_service(bar_id)
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

@bar_bp.route('/api/v1/addBar', methods=['POST'])
def add_bar():
    data = request.json
    bar_name = data.get('bar_name')
    bar_location = data.get('bar_location')
    bar_detail = data.get('bar_detail')

    if not all([bar_name, bar_location]):
        return jsonify({'message': 'Missing required fields'}), 400

    bar_id = add_bar_service(bar_name, bar_location, bar_detail)
    return jsonify({'message': 'Bar added successfully', 'bar_id': bar_id}), 201

@bar_bp.route('/api/v1/updateBar/<int:bar_id>', methods=['PUT'])
def update_bar(bar_id):
    data = request.json
    updated = update_bar_service(bar_id, data)
    if not updated:
        return jsonify({'message': 'Bar not found'}), 404

    return jsonify({'message': 'Bar updated successfully'})

@bar_bp.route('/api/v1/deleteBar/<int:bar_id>', methods=['DELETE'])
def delete_bar(bar_id):
    deleted = delete_bar_service(bar_id)
    if not deleted:
        return jsonify({'message': 'Bar not found'}), 404

    return jsonify({'message': 'Bar deleted successfully'})