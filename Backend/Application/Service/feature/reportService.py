from Infrastructure.Repository.reportRepository import (
    get_all_report,
    get_report_by_id,
    add_report,
    update_report,
    delete_report
)

def get_all_report_service():
    return get_all_report()

def get_report_by_id_service(report_id):
    return get_report_by_id(report_id)

def add_report_service(user_id, zone_id, report_status, report_type, report_message, report_image):
    return add_report(user_id, zone_id, report_status, report_type, report_message, report_image)

def update_report_service(report_id, data):
    return update_report(report_id, data)

def delete_report_service(report_id):
    return delete_report(report_id)
