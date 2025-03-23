from flask import Blueprint, request, jsonify
from Application.Service.feature.reviewService import get_all_reviews_service, get_review_by_id_service, add_review_service, update_review_service, delete_review_service

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
    data = request.json
    user_id = data.get('user_id')
    restaurant_id = data.get('restaurant_id')
    rating = data.get('rating')
    comment = data.get('comment')
    review_image = data.get('review_image') 

    # Validate required fields
    if not all([user_id, restaurant_id, rating]):
        return jsonify({'message': 'Missing required fields'}), 400

    # Validate rating range
    if not (1 <= rating <= 5):
        return jsonify({'message': 'Rating must be between 1 and 5'}), 400

    review_id = add_review_service(user_id, restaurant_id, rating, comment, review_image)  # เพิ่ม review_image ในการเพิ่มรีวิว
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
