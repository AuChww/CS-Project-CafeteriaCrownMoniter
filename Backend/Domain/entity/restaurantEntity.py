class RestaurantEntity:
    def __init__(self, restaurant_id, zone_id, restaurant_name, restaurant_location, restaurant_detail=None, restaurant_rating=0, total_rating=0, total_reviews=0,restaurant_image=None,current_visitor_count=0, update_date_time=None):
        self.restaurant_id = restaurant_id
        self.zone_id = zone_id
        self.restaurant_name = restaurant_name
        self.restaurant_location = restaurant_location
        self.restaurant_detail = restaurant_detail
        self.restaurant_rating = restaurant_rating
        self.total_rating = total_rating
        self.total_reviews = total_reviews
        self.restaurant_image = restaurant_image
        self.current_visitor_count = current_visitor_count
        self.update_date_time = update_date_time
