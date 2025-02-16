class RestaurantVisitorHistoryEntity:
    def __init__(self,restaurant_visitor_history_id, date_time, restaurant_id, visitor_count):
        self.restaurant_visitor_history_id = restaurant_visitor_history_id
        self.date_time = date_time
        self.restaurant_id = restaurant_id
        self.visitor_count = visitor_count
