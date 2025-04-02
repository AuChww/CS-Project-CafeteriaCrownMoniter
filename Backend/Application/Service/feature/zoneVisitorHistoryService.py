from Infrastructure.Repository.zoneVisitorHistoryRepository import (
    get_all_zone_visitor_histories,
    get_visitor_history_by_zone_id,
    add_zone_visitor_history,
    update_zone_visitor_history,
    delete_zone_visitor_history
)
from Infrastructure.Repository.zoneRepository import (
    get_all_zones
)

def get_all_zones_service():
    zones = get_all_zones()
    return [zone.zone_id for zone in zones]

def get_all_zone_visitor_histories_service():
    return get_all_zone_visitor_histories()

def get_visitor_history_by_zone_id_service(visitor_history_id):
    return get_visitor_history_by_zone_id(visitor_history_id)

def add_zone_visitor_history_service(date_time, zone_id, visitor_count):
    return add_zone_visitor_history(date_time, zone_id, visitor_count)

def update_zone_visitor_history_service(visitor_history_id, data):
    return update_zone_visitor_history(visitor_history_id, data)

def delete_zone_visitor_history_service(visitor_history_id):
    return delete_zone_visitor_history(visitor_history_id)
