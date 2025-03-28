from Infrastructure.Repository.reportRepository import (
    get_all_reports,
    get_report_by_id,
    add_report,
    update_report,
    update_report_image,
    delete_report
)

def get_all_reports_service():
    return get_all_reports()

def get_report_by_id_service(report_id):
    return get_report_by_id(report_id)

def add_report_service(user_id, zone_id, report_status, report_type, report_message=None):
    return add_report(user_id, zone_id, report_status, report_type, report_message)

def update_report_service(report_id, data):
    print("Debug data:", data)
    return update_report(report_id, data)

def update_report_image_service (report_id, file_name):
    return update_report_image(report_id, file_name)

def delete_report_service(report_id):
    return delete_report(report_id)
