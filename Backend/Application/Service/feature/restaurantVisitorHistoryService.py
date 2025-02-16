from Infrastructure.Repository.restaurantVisitorHistoryRepository import (
    get_all_restaurant_visitor_histories,
    get_visitor_history_by_restaurant_id,
    add_restaurant_visitor_history,
    update_restaurant_visitor_history,
    delete_restaurant_visitor_history
)
from Infrastructure.Repository.restaurantRepository import (
    get_all_restaurants
)

def get_all_restaurants_service():
    restaurants = get_all_restaurants()  # Get all restaurantEntity objects
    # Extract and return only the restaurant_id from each restaurantEntity
    return [restaurant.restaurant_id for restaurant in restaurants]

def get_all_restaurant_visitor_histories_service():
    return get_all_restaurant_visitor_histories()

def get_visitor_history_by_restaurant_id_service(visitor_history_id):
    return get_visitor_history_by_restaurant_id(visitor_history_id)

def add_restaurant_visitor_history_service(date_time, restaurant_id, visitor_count):
    return add_restaurant_visitor_history(date_time, restaurant_id, visitor_count)

def update_restaurant_visitor_history_service(visitor_history_id, data):
    return update_restaurant_visitor_history(visitor_history_id, data)

def delete_restaurant_visitor_history_service(visitor_history_id):
    return delete_restaurant_visitor_history(visitor_history_id)
