from flask import Blueprint, request, jsonify, send_from_directory
from Application.Service.feature.reviewService import get_all_reviews_service, get_review_by_id_service, add_review_service, update_review_service, update_review_image_service, delete_review_service

import os

review_bp = Blueprint('reviews', __name__)

@review_bp.route('/api/v1/getAllReviews', methods=['GET'])
def get_all_reviews():
    reviews = get_all_reviews_service()
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

@review_bp.route('/api/v1/getReviewId/<int:review_id>', methods=['GET'])
def get_review_by_id(review_id):
    review = get_review_by_id_service(review_id)
    if not review:
        return jsonify({'message': 'Review not found'}), 404

    return jsonify({
        'review_id': review.review_id,
        'user_id': review.user_id,
        'restaurant_id': review.restaurant_id,
        'rating': review.rating,
        'comment': review.review_comment,
        'created_time': review.created_time,
        'update_time': review.update_time,
        'review_image': review.review_image  # เพิ่มฟิลด์ review_image
    })

@review_bp.route('/api/v1/addReview', methods=['POST'])
def add_review():
    data = request.form
    user_id = data.get('user_id')
    restaurant_id = data.get('restaurant_id')
    rating = int(data.get('rating'))
    comment = data.get('comment')
    review_image = request.files.get('review_image') 

    # Validate required fields
    if not all([user_id, restaurant_id, rating]):
        return jsonify({'message': 'Missing required fields'}), 400

    # Validate rating range
    if not (1 <= rating <= 5):
        return jsonify({'message': 'Rating must be between 1 and 5'}), 400

    review_id = add_review_service(user_id, restaurant_id, rating, comment)  
    
    
    if review_image:
        file_path = f'public/image/reviewImages/review{review_id}.png'
        file_name = f'review{review_id}.png'
        review_image.save(file_path)
        print(f"Image saved to {file_path}")
        update_review_image_service(review_id, file_name)  
    else:
        file_name = None
 
    

    return jsonify({'message': 'Review added successfully', 'review_id': review_id}), 201

@review_bp.route('/api/v1/updateReview/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    data = request.json
    user_id = data.get('user_id')
    restaurant_id = data.get('restaurant_id')
    rating = data.get('rating')
    comment = data.get('comment')
    review_image = data.get('review_image')  # รับค่า review_image

    # Validate required fields
    if not all([user_id, restaurant_id, rating]):
        return jsonify({'message': 'Missing required fields'}), 400

    # Validate rating range
    if not (1 <= rating <= 5):
        return jsonify({'message': 'Rating must be between 1 and 5'}), 400

    updated = update_review_service(review_id, user_id, restaurant_id, rating, comment, review_image)
    if updated:
        return jsonify({'message': 'Review updated successfully'}), 200
    else:
        return jsonify({'message': 'Review not found or failed to update'}), 404

@review_bp.route('/api/v1/deleteReview/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    reviews = get_review_by_id_service(review_id)

    deleted = delete_review_service(review_id, reviews.restaurant_id)
    if deleted:
        return jsonify({'message': 'Review deleted successfully'}), 200
    else:
        return jsonify({'message': 'Review not found or failed to delete'}), 404
    


IMAGE_FOLDER = 'public/image/reviewImages'

@review_bp.route('/api/v1/getReviewImage/<string:file_name>', methods=['GET'])
def get_image_url(file_name):
    file_path = os.path.join(IMAGE_FOLDER, file_name)
    
    if not os.path.isfile(file_path):
        return jsonify({"url": None}), 200 

    image_url = f"http://localhost:8000/public/image/reviewImages/{file_name}"
    return jsonify({"url": image_url})

@review_bp.route('/public/image/reviewImages/<path:file_name>')
def serve_actual_image(file_name):
    image_directory = os.path.join(os.getcwd(), "public", "image", "reviewImages")
    return send_from_directory(image_directory, file_name)
