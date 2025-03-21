from flask import Blueprint, request, jsonify, send_from_directory
from Application.Service.feature.userService import (
    get_all_users_service,
    get_user_by_id_service,
    get_reviews_by_user_id_service,
    get_user_image_service,
    get_all_reports_by_user_id_service,
    update_user_image_service,
    add_user_service,
    update_user_service,
    delete_user_service,
)
import os

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



IMAGE_FOLDER = 'public/image/userImages'

@user_bp.route('/api/v1/getUserImage/<string:file_name>', methods=['GET'])
def get_image_url(file_name):
    file_path = os.path.join(IMAGE_FOLDER, file_name)

    if not os.path.isfile(file_path):
        file_name = 'default.png'
    
    image_url = f"http://localhost:8000/public/image/userImages/{file_name}"

    return jsonify({"url": image_url})


@user_bp.route('/api/v1/updateUser/<int:user_id>', methods=['PATCH'])
def update_user(user_id):
    
    data = request.form.to_dict()  
    user_image = request.files.get('user_image')
    user_id = data.get('user_id')
    username = data.get('username')
    email = data.get('email')
    

    if not user_id:
        return jsonify({'message': 'User ID is required'}), 400 
    
    if user_image:
        print(f"Received file: {user_image.filename}")
    
    updated = update_user_service(user_id, data)
    
    previous_file_name = get_user_image_service(user_id)
    
    file_name = f'user{user_id}.png'
    file_path = os.path.join('public', 'image', 'userImages', file_name)
    if user_image:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)  
                print(f"Old image {file_path} deleted.")
            except Exception as e:
                print(f"Error deleting old image: {e}")

        try:
            user_image.save(file_path)  
            print(f"New image saved to {file_path}")
        except Exception as e:
            print(f"Error saving image: {e}")
            return jsonify({'message': 'Failed to save image'}), 500
    else:
        file_name = previous_file_name if previous_file_name else 'default.png' 


    data['user_image'] = file_name

    update_user_image_service(user_id, file_name)  
    
    
    if not updated:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({'message': 'User updated successfully'})

@user_bp.route('/public/image/userImages/<path:file_name>')
def serve_actual_image(file_name):
    image_directory = os.path.join(os.getcwd(), "public", "image", "userImages")
    return send_from_directory(image_directory, file_name)


@user_bp.route('/api/v1/deleteUser/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    deleted = delete_user_service(user_id)
    if not deleted:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({'message': 'User deleted successfully'})
