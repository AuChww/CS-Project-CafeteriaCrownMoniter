class RestaurantEntity:
    def __init__(self, restaurant_id, bar_id, restaurant_name, restaurant_location, restaurant_detail=None, total_rating=0, total_reviews=0):
        self.restaurant_id = restaurant_id
        self.bar_id = bar_id
        self.restaurant_name = restaurant_name
        self.restaurant_location = restaurant_location
        self.restaurant_detail = restaurant_detail
        self.total_rating = total_rating
        self.total_reviews = total_reviews