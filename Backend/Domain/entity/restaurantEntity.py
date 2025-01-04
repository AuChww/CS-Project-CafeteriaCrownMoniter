class RestaurantEntity:
    def __init__(self, restaurant_id, zone_id, restaurant_name, restaurant_location, restaurant_detail=None, total_rating=0, total_reviews=0, restaurant_image=None):
        self.restaurant_id = restaurant_id
        self.zone_id = zone_id
        self.restaurant_name = restaurant_name
        self.restaurant_location = restaurant_location
        self.restaurant_detail = restaurant_detail
        self.total_rating = total_rating
        self.total_reviews = total_reviews
        self.restaurant_image = restaurant_image
