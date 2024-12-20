import cv2
from ultralytics import YOLO
from Domain.entity.yoloEntity import Zone

class YoloService:
    def __init__(self):
        self.model = YOLO("yolov8n.pt")  # โหลดโมเดล YOLOv8

    def count_people(self, video_path, zone_points):
        zone = Zone(points=zone_points)
        cap = cv2.VideoCapture(video_path)
        count = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # ตรวจจับวัตถุ
            results = self.model(frame)
            for result in results:
                for box in result.boxes:
                    if box.cls == 0:  # class 0 คือคนใน YOLO
                        x, y, w, h = map(int, box.xywh[0])
                        center = (x + w // 2, y + h // 2)

                        # ตรวจสอบว่าอยู่ในโซนหรือไม่
                        if zone.is_inside(center):
                            count += 1

            # วาด polyline
            cv2.polylines(frame, [zone.get_points()], isClosed=True, color=(0, 255, 0), thickness=2)

        cap.release()
        return {"people_count": count}
