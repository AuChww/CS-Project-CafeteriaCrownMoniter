from Infrastructure.Repository.barRepository import get_all_bars,get_bar_by_id, get_all_restaurants_by_bar_id, get_all_reviews_by_bar_id

def get_all_bars_service():
    return get_all_bars()

def get_bar_by_id_service(bar_id):
    return get_bar_by_id(bar_id)

def get_all_restaurants_by_bar_id_service(bar_id):
    return get_all_restaurants_by_bar_id(bar_id)

def get_all_reviews_by_bar_id_service(bar_id):
    return get_all_reviews_by_bar_id(bar_id)

