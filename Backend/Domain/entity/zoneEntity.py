from dataclasses import dataclass

@dataclass
class ZoneEntity:
    zone_id: int
    bar_id: int
    zone_name: str
    zone_detail: str
    current_count: int
