class ZoneEntity:
    def __init__(self, zone_id, bar_id, zone_name, zone_detail=None, max_people_in_zone=0, current_visitor_count=0, update_date_time=None, zone_time=None):
        self.zone_id = zone_id
        self.bar_id = bar_id
        self.zone_name = zone_name
        self.zone_detail = zone_detail
        self.max_people_in_zone = max_people_in_zone
        self.current_visitor_count = current_visitor_count
        self.update_date_time = update_date_time
        self.zone_time = zone_time
