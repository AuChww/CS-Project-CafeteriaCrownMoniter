class ReviewEntity:
    def __init__(self, review_id, user_id, restaurant_id, rating, review_comment=None, created_time=None, update_time=None, review_image=None):
        self.review_id = review_id
        self.user_id = user_id
        self.restaurant_id = restaurant_id
        self.rating = rating
        self.review_comment = review_comment
        self.created_time = created_time
        self.update_time = update_time
        self.review_image = review_image
