class ReviewEntity:
    def __init__(self, review_id, user_id, restaurant_id, rating, comment, created_at, review_image=None):
        self.review_id = review_id
        self.user_id = user_id
        self.restaurant_id = restaurant_id
        self.rating = rating
        self.comment = comment
        self.created_at = created_at
        self.review_image = review_image  # เพิ่มฟิลด์ review_image
