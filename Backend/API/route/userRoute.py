from flask import Blueprint, request, jsonify
from Application.Service.feature.userService import (
    get_all_users_service,
    get_user_by_id_service,
    get_reviews_by_user_id_service,
    get_all_reports_by_user_id_service,
    add_user_service,
    update_user_service,
    delete_user_service,
)

user_bp = Blueprint('user', __name__)

@user_bp.route('/api/v1/getAllUsers', methods=['GET'])
def get_all_users():
    users = get_all_users_service()
    user_list = [
        {
            'user_id': user.user_id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'user_image': user.user_image
        }
        for user in users
    ]
    return jsonify({'users': user_list})

@user_bp.route('/api/v1/getUserId/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    user = get_user_by_id_service(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'user_id': user.user_id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'user_image': user.user_image
    })

@user_bp.route('/api/v1/getReviewByUserId/<int:user_id>/reviews', methods=['GET'])
def get_reviews_by_user_id(user_id):
    reviews = get_reviews_by_user_id_service(user_id)
    review_list = [
        {
            'review_id': r.review_id,
            'restaurant_id': r.restaurant_id,
            'rating': r.rating,
            'comment': r.comment,
            'created_at': r.created_at
        }
        for r in reviews
    ]
    return jsonify({'reviews': review_list})

@user_bp.route('/api/v1/getReportsByUserId/<int:user_id>/reports', methods=['GET'])
def get_reports_by_user_id(user_id):
    reports = get_all_reports_by_user_id_service(user_id)
    report_list = [
        {
            'report_id': r.report_id,
            'zone_id': r.zone_id,
            'report_status': r.report_status,
            'report_type': r.report_type,
            'report_message': r.report_message,
            'created_time': r.created_time,
            'report_image': r.report_image
        }
        for r in reports
    ]
    return jsonify({'reports': report_list})

@user_bp.route('/api/v1/addUser', methods=['POST'])
def add_user():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    user_image = data.get('user_image')

    if not all([username, email, password, role]):
        return jsonify({'message': 'Missing required fields'}), 400

    user_id = add_user_service(username, email, password, role, user_image)
    return jsonify({'message': 'User added successfully', 'user_id': user_id}), 201

@user_bp.route('/api/v1/updateUser/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    updated = update_user_service(user_id, data)
    if not updated:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({'message': 'User updated successfully'})

@user_bp.route('/api/v1/deleteUser/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    deleted = delete_user_service(user_id)
    if not deleted:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({'message': 'User deleted successfully'})
