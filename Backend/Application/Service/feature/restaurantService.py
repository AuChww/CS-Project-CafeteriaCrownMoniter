from Infrastructure.Repository.restaurantRepository import (
    get_all_restaurants,
    get_restaurant_by_id,
    get_all_reviews_by_restaurant_id,
    add_restaurant, 
    update_restaurant, 
    delete_restaurant
)

def get_all_restaurants_service():
    return get_all_restaurants()

def get_restaurant_by_id_service(restaurant_id):
    return get_restaurant_by_id(restaurant_id)

def get_all_reviews_by_restaurant_id_service(restaurant_id):
    return get_all_reviews_by_restaurant_id(restaurant_id)

def add_restaurant_service(bar_id, restaurant_name, restaurant_location, restaurant_detail):
    return add_restaurant(bar_id, restaurant_name, restaurant_location, restaurant_detail)

def update_restaurant_service(restaurant_id, data):
    return update_restaurant(restaurant_id, data)

def delete_restaurant_service(restaurant_id):
    return delete_restaurant(restaurant_id)