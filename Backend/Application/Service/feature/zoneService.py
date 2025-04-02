from Infrastructure.Repository.zoneRepository import (
    get_all_zones,
    get_zone_by_id,
    get_visitor_history_by_zone_id,
    get_restaurant_by_zone_id,
    get_all_report_by_zone_id,
    get_zone_image,
    add_zone,
    update_zone_image_path,
    update_zone,
    update_zone_count,
    delete_zone
)

def get_all_zones_service():
    return get_all_zones()

def get_zone_by_id_service(zone_id):
    return get_zone_by_id(zone_id)

def get_visitor_history_by_zone_id_service(zone_id):
    return get_visitor_history_by_zone_id(zone_id)

def get_restaurant_by_zone_id_service(zone_id):
    return get_restaurant_by_zone_id(zone_id)

def get_all_report_by_zone_id_service(zone_id):
    return get_all_report_by_zone_id(zone_id)

def get_zone_image_service(zone_id):
    return get_zone_image(zone_id)

def add_zone_service(bar_id, zone_name, zone_detail, max_people_in_zone, current_visitor_count, zone_time):
    return add_zone(bar_id, zone_name, zone_detail, max_people_in_zone, current_visitor_count, zone_time)

def update_zone_image (zone_id, file_name):
    return update_zone_image_path(zone_id, file_name)

def update_zone_service(zone_id, data):
    return update_zone(zone_id, data)

def update_zone_count_service(zone_id, count, update_date_time):
    return update_zone_count(zone_id, count, update_date_time)

def delete_zone_service(zone_id):
    return delete_zone(zone_id)

