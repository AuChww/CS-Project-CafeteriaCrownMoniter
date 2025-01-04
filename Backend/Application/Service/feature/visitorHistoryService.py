from Infrastructure.Repository.visitorHistoryRepository import (
    get_all_visitor_histories,
    get_visitor_history_by_id,
    add_visitor_history,
    update_visitor_history,
    delete_visitor_history
)

def get_all_visitor_histories_service():
    return get_all_visitor_histories()

def get_visitor_history_by_id_service(visitor_history_id):
    return get_visitor_history_by_id(visitor_history_id)

def add_visitor_history_service(date_time, zone_id, visitor_count):
    return add_visitor_history(date_time, zone_id, visitor_count)

def update_visitor_history_service(visitor_history_id, data):
    return update_visitor_history(visitor_history_id, data)

def delete_visitor_history_service(visitor_history_id):
    return delete_visitor_history(visitor_history_id)
