# คัดเอามาแค่ 5 วิแรก
import torch
import cv2
import numpy as np
import os
from ultralytics import YOLO

# import os
# os.environ['QT_QPA_PLATFORM'] = 'xcb'
# os.environ['QT_QPA_PLATFORM_PLUGIN_PATH'] = '/usr/lib/x86_64-linux-gnu/qt5/plugins/platforms'

# โหลด YOLOv8 pre-trained model
model = YOLO('yoloModel/yolov8s.pt')  # ใช้โมเดล YOLOv8

# โหลด Haar Cascade สำหรับตรวจจับใบหน้า
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# เปิดวิดีโอด้วย OpenCV
def get_zone_human_count(video_id):

    video_path = os.path.join(os.path.dirname(__file__), f"../public/video/zone/{video_id}.mp4")
        # ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
    if not os.path.exists(video_path):
        print(f"Video file for zone {video_id} not found.")
        return 0  
    
    cap = cv2.VideoCapture(video_path)
    
    roi_zones = {
    1: {"top_left": (50, 50), "bottom_right": (1500, 1500)},
    2: {"top_left": (50, 50), "bottom_right": (1500, 1500)},
    3: {"top_left": (100, 100), "bottom_right": (1400, 1400)}
}

    # ตรวจสอบว่ามีการกำหนดโซนนี้หรือไม่
    if id in roi_zones:
        roi_top_left = roi_zones[id]["top_left"]
        roi_bottom_right = roi_zones[id]["bottom_right"]
    else:
        roi_top_left = (50,50)
        roi_bottom_right = (1500, 1500)  

    # # กำหนดพื้นที่ที่ต้องการนับ (ROI)
    # roi_top_left = (50, 50)  # จุดมุมบนซ้าย
    # roi_bottom_right = (1500, 1500)  # จุดมุมล่างขวา

    # ตัวแปรเก็บจำนวนคนในแต่ละเฟรม
    all_human_counts = []
    frame_number = 0

    # หาความยาวของวิดีโอ (ในหน่วยเฟรม)
    fps = cap.get(cv2.CAP_PROP_FPS)  # Frames per second
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # คำนวณจำนวนเฟรมที่ต้องการให้ได้ 5 วินาที
    frames_to_process = int(fps * 1)  # 5 วินาทีแรก

    while True:
        ret, frame = cap.read()
        if not ret or frame_number >= frames_to_process:
            break  # ออกจาก loop ถ้าหมดวิดีโอหรือประมวลผลครบ 5 วินาที

        frame_number += 1

        # ข้ามทุก ๆ 10 เฟรม
        if frame_number % 10 != 0:
            continue

        results = model(frame)
        detections = results[0].boxes.xyxy.cpu().numpy()  # ดึงข้อมูล bounding boxes
        classes = results[0].boxes.cls.cpu().numpy()     # ดึงข้อมูล class
        
        human_count = 0

        for i, box in enumerate(detections):
            left, top, right, bottom = map(int, box[:4])
            cls = int(classes[i])

            # ตรวจจับเฉพาะคน และอยู่ใน ROI
            if cls == 0 and (left > roi_top_left[0] and right < roi_bottom_right[0] and
                             top > roi_top_left[1] and bottom < roi_bottom_right[1]):  
                human_count += 1

        all_human_counts.append(human_count)

        # แสดงผลแค่ทุกๆ 60 เฟรม
        if frame_number % 30 == 0:
            print(f"Frame {frame_number}: zone {video_id} : Human Count = {human_count}")
            
        # cv2.imshow('YOLOv8 Human Detection', frame)

    cap.release()
    cv2.destroyAllWindows()

    # คืนค่าตัวสุดท้ายของ all_human_counts
    return all_human_counts[-1] if all_human_counts else 0

# get_zone_human_count(9,'zone')


def get_restaurant_human_count(restaurant_id_first,restaurant_id_second):
    # สร้าง path ไปยังไฟล์วิดีโอ
    # zone_id = "{zone_id}.mp4"
    video_path = os.path.join(os.path.dirname(__file__), f"../public/video/restaurant/{restaurant_id_first,restaurant_id_second}.mp4")
    
    if not os.path.exists(video_path):
        print(f"Video file {restaurant_id_first,restaurant_id_second} not found.")
        return 0  
    
    cap = cv2.VideoCapture(video_path)

    # กำหนด ROI (Region of Interest)
    roi_areas = {
        restaurant_id_first: [(0, 0), (200, 400)],  
        restaurant_id_second : [(200, 0), (400, 400)],
    }

    frame_number = 0
    human_counts = {zone: [] for zone in roi_areas}

    def is_within_roi(left, top, right, bottom, roi_top_left, roi_bottom_right):
        return (left > roi_top_left[0] and right < roi_bottom_right[0] and
                top > roi_top_left[1] and bottom < roi_bottom_right[1])
    
    # หาความยาวของวิดีโอ (ในหน่วยเฟรม)
    fps = cap.get(cv2.CAP_PROP_FPS)  # Frames per second
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    frames_to_process = int(fps * 100)  # 5 วินาทีแรก

    while True:
        ret, frame = cap.read()
        if not ret or frame_number >= frames_to_process:
            break  # ออกจาก loop ถ้าหมดวิดีโอหรือประมวลผลครบ 5 วินาที

        frame_number += 1

        # ข้ามการตรวจจับบางเฟรม เพื่อลดภาระ (เช่น ประมวลผลทุก 5 เฟรม)
        if frame_number % 10 != 0:
            continue

        
        small_frame = cv2.resize(frame, (640, 360))
        print(f"after small frame {restaurant_id_first,restaurant_id_second}")

        results = model(small_frame)
        detections = results[0].boxes.xyxy.cpu().numpy()
        classes = results[0].boxes.cls.cpu().numpy()

        current_counts = {zone: 0 for zone in roi_areas}
        
        

        for i, box in enumerate(detections):
            left, top, right, bottom = map(int, box[:4])
            cls = int(classes[i])

            if cls == 0:  # ตรวจจับเฉพาะคน
                for zone, (roi_top_left, roi_bottom_right) in roi_areas.items():
                    if is_within_roi(left, top, right, bottom, roi_top_left, roi_bottom_right):
                        current_counts[zone] += 1

        # บันทึกจำนวนคนในแต่ละ ROI
        for zone in roi_areas:
            human_counts[zone].append(current_counts[zone])

        # แสดงผลแค่ทุกๆ 10 เฟรม
        if frame_number % 60 == 0:
            for zone, (roi_top_left, roi_bottom_right) in roi_areas.items():
                cv2.rectangle(frame, roi_top_left, roi_bottom_right, (0, 0, 255), 2)
                cv2.putText(frame, f"{zone}: {current_counts[zone]}", (roi_top_left[0], roi_top_left[1] - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                
            cv2.imshow('YOLOv8 Human Detection', frame)

        # if cv2.waitKey(1) & 0xFF == ord('q'):
        #     break

    cap.release()
    # cv2.destroyAllWindows()
    
    for zone in roi_areas:
        print(f"{zone}: {human_counts[zone][-1] if human_counts[zone] else 0}")

    print(f"success human count")

    return [ (zone, human_counts[zone][-1] if human_counts[zone] else 0) for zone in roi_areas ]

# get_restaurant_human_count(3,4)