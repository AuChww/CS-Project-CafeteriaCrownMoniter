from dataclasses import dataclass
from datetime import datetime

@dataclass
class DetectionEntity:
    detection_id: int
    zone_id: int
    detection_time: datetime
    person_count: int
