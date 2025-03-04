class ReportEntity:
    def __init__(self, report_id, user_id, zone_id, report_status, report_type, report_message=None, created_time=None, report_image=None):
        self.report_id = report_id
        self.user_id = user_id
        self.zone_id = zone_id
        self.report_status = report_status
        self.report_type = report_type
        self.report_message = report_message
        self.created_time = created_time
        self.report_image = report_image
