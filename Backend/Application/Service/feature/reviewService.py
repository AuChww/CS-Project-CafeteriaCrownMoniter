from Infrastructure.Repository.reviewRepository import (
    get_all_reviews,
    get_review_by_id,
    add_review,
    update_review,
    delete_review
)

def get_all_reviews_service():
    return get_all_reviews()

def get_review_by_id_service(review_id):
    return get_review_by_id(review_id)

def add_review_service(user_id, restaurant_id, rating, comment, review_image=None):
    return add_review(user_id, restaurant_id, rating, comment, review_image)

def update_review_service(review_id, user_id, restaurant_id, rating, comment, review_image=None):
    return update_review(review_id, user_id, restaurant_id, rating, comment, review_image)

def delete_review_service(review_id, restaurant_id):
    return delete_review(review_id, restaurant_id)
