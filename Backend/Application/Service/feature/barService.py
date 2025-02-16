from Infrastructure.Repository.barRepository import update_bar_visitor_count, get_all_bars, get_bar_by_id, get_all_restaurants_by_bar_id, get_all_reviews_by_bar_id, get_all_zones_by_bar_id, add_bar, update_bar, delete_bar
from Infrastructure.Repository.zoneRepository import get_total_visitors_by_bar

def update_bar_visitors(bar_id):
    total_visitors = get_total_visitors_by_bar(bar_id)
    update_bar_visitor_count(bar_id, total_visitors)
    return total_visitors  # ส่งค่ากลับเพื่อใช้แสดงผล

def get_all_bars_service():
    return get_all_bars()

def get_bar_by_id_service(bar_id):
    return get_bar_by_id(bar_id)

def get_all_restaurants_by_bar_id_service(bar_id):
    return get_all_restaurants_by_bar_id(bar_id)

def get_all_reviews_by_bar_id_service(bar_id):
    return get_all_reviews_by_bar_id(bar_id)

def get_all_zones_by_bar_id_service(bar_id):
    return get_all_zones_by_bar_id(bar_id)

def add_bar_service(bar_name, bar_location, bar_detail, bar_image):
    return add_bar(bar_name, bar_location, bar_detail, bar_image)

def update_bar_service(bar_id, data):
    return update_bar(bar_id, data)

def delete_bar_service(bar_id):
    return delete_bar(bar_id)
