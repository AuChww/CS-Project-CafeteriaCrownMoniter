# import torch
# import cv2
# import numpy as np
# from ultralytics import YOLO

# # โหลด YOLOv8 pre-trained model
# model = YOLO('yolov8s.pt')  # ใช้โมเดล YOLOv8

# # เปิดการเข้าถึงกล้อง
# cap = cv2.VideoCapture(0)

# # กำหนดพื้นที่ที่ต้องการนับ (ROI)
# roi_top_left = (50, 50)  # จุดมุมบนซ้าย
# roi_bottom_right = (1500, 1500)  # จุดมุมล่างขวา

# # ตัวแปรนับจำนวนคนใน ROI
# human_count = 0
# detected_humans = []  # ตัวแปรเก็บข้อมูลของคนที่ตรวจพบ

# # ตัวแปรเก็บ bounding box ของคนในเฟรมก่อนหน้า
# previous_people = []

# # ฟังก์ชันตรวจสอบว่าคนอยู่ในพื้นที่ ROI หรือไม่
# def is_within_roi(left, top, right, bottom, roi_top_left, roi_bottom_right):
#     return (left > roi_top_left[0] and right < roi_bottom_right[0] and
#             top > roi_top_left[1] and bottom < roi_bottom_right[1])

# while True:
#     ret, frame = cap.read()
#     if not ret:
#         break

#     results = model(frame)
#     frame_h, frame_w, _ = frame.shape
#     detections = results[0].boxes.xyxy.cpu().numpy()  # ดึงข้อมูล bounding boxes
#     classes = results[0].boxes.cls.cpu().numpy()     # ดึงข้อมูล class
#     human_count = 0
#     current_people = []

#     for i, box in enumerate(detections):
#         left, top, right, bottom = map(int, box[:4])
#         cls = int(classes[i])

#         if cls == 0 and is_within_roi(left, top, right, bottom, roi_top_left, roi_bottom_right):  # ตรวจจับเฉพาะคน
#             current_people.append((left, top, right, bottom))  # เก็บ bounding box ของคนในเฟรมนี้
#             cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
#             cv2.putText(frame, f"Person", (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

#     # นับจำนวนคนใหม่ที่เพิ่มเข้ามาใน ROI
#     for person in current_people:
#         if person not in previous_people:
#             human_count += 1

#     previous_people = current_people  # อัปเดต bounding box ของเฟรมปัจจุบันไปยังตัวแปร previous_people

#     # แสดงจำนวนคนที่ตรวจจับได้
#     cv2.putText(frame, f"Human Count: {human_count}", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)
#     cv2.rectangle(frame, roi_top_left, roi_bottom_right, (0, 255, 0), 2)  # วาด ROI

#     cv2.imshow('YOLOv8 Object Detection - Human Count', frame)

#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break


# # ปิดการเข้าถึงกล้อง
# cap.release()
# cv2.destroyAllWindows()



# ----------------------------------------------------------------------------------------------
# With blur all body


# import torch
# import cv2
# import numpy as np
# from ultralytics import YOLO

# # โหลด YOLOv8 pre-trained model
# model = YOLO('yolov8s.pt')  # ใช้โมเดล YOLOv8

# # เปิดการเข้าถึงกล้อง
# cap = cv2.VideoCapture(0)

# # กำหนดพื้นที่ที่ต้องการนับ (ROI)
# roi_top_left = (50, 50)  # จุดมุมบนซ้าย
# roi_bottom_right = (1500, 1500)  # จุดมุมล่างขวา

# # ตัวแปรนับจำนวนคนใน ROI
# human_count = 0
# detected_humans = []  # ตัวแปรเก็บข้อมูลของคนที่ตรวจพบ

# # ตัวแปรเก็บ bounding box ของคนในเฟรมก่อนหน้า
# previous_people = []

# # ฟังก์ชันตรวจสอบว่าคนอยู่ในพื้นที่ ROI หรือไม่
# def is_within_roi(left, top, right, bottom, roi_top_left, roi_bottom_right):
#     return (left > roi_top_left[0] and right < roi_bottom_right[0] and
#             top > roi_top_left[1] and bottom < roi_bottom_right[1])

# while True:
#     ret, frame = cap.read()
#     if not ret:
#         break

#     results = model(frame)
#     frame_h, frame_w, _ = frame.shape
#     detections = results[0].boxes.xyxy.cpu().numpy()  # ดึงข้อมูล bounding boxes
#     classes = results[0].boxes.cls.cpu().numpy()     # ดึงข้อมูล class
#     human_count = 0
#     current_people = []

#     for i, box in enumerate(detections):
#         left, top, right, bottom = map(int, box[:4])
#         cls = int(classes[i])

#         if cls == 0 and is_within_roi(left, top, right, bottom, roi_top_left, roi_bottom_right):  # ตรวจจับเฉพาะคน
#             current_people.append((left, top, right, bottom))  # เก็บ bounding box ของคนในเฟรมนี้
            
#             # เบลอใบหน้าใน Bounding Box
#             face_region = frame[top:bottom, left:right]
#             blurred_face = cv2.GaussianBlur(face_region, (51, 51), 30)
#             frame[top:bottom, left:right] = blurred_face
            
#             cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
#             cv2.putText(frame, f"Person", (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

#     # นับจำนวนคนใหม่ที่เพิ่มเข้ามาใน ROI
#     for person in current_people:
#         if person not in previous_people:
#             human_count += 1

#     previous_people = current_people  # อัปเดต bounding box ของเฟรมปัจจุบันไปยังตัวแปร previous_people

#     # แสดงจำนวนคนที่ตรวจจับได้
#     cv2.putText(frame, f"Human Count: {human_count}", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)
#     cv2.rectangle(frame, roi_top_left, roi_bottom_right, (0, 255, 0), 2)  # วาด ROI

#     cv2.imshow('YOLOv8 Object Detection - Human Count with Privacy', frame)

#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

# # ปิดการเข้าถึงกล้อง
# cap.release()
# cv2.destroyAllWindows()
# ----------------------------------------------------------------------------------------------

# Face blur

# import torch
# import cv2
# import numpy as np
# import os
# from ultralytics import YOLO

# # โหลด YOLOv8 pre-trained model
# model = YOLO('yoloModel/yolov8s.pt')  # ใช้โมเดล YOLOv8

# # โหลด Haar Cascade สำหรับตรวจจับใบหน้า
# face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# # # เปิดการเข้าถึงกล้อง
# # cap = cv2.VideoCapture(0)


# # เปิดวิดีโอด้วย OpenCV
# def get_human_count(zone_id):
    
#     # สร้าง path ไปยังไฟล์วิดีโอ
#     zone_id = f"vid_zone_{zone_id}.mp4"
#     video_path = os.path.join(os.path.dirname(__file__), "../public/video/{zone_id}")
#     # ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
#     if not os.path.exists(video_path):
#         print(f"Video file for zone {zone_id} not found.")
#         return 0  # ถ้าไม่มีวิดีโอ ให้คืนค่า 0 ไปเลย
    
#     cap = cv2.VideoCapture(video_path)


#     # กำหนดพื้นที่ที่ต้องการนับ (ROI)
#     roi_top_left = (50, 50)  # จุดมุมบนซ้าย
#     roi_bottom_right = (1500, 1500)  # จุดมุมล่างขวา

#     # ตัวแปรนับจำนวนคนใน ROI
#     human_count = 0
#     previous_people = []
#     frame_number = 0

#     # ฟังก์ชันตรวจสอบว่าคนอยู่ในพื้นที่ ROI หรือไม่
#     def is_within_roi(left, top, right, bottom, roi_top_left, roi_bottom_right):
#         return (left > roi_top_left[0] and right < roi_bottom_right[0] and
#                 top > roi_top_left[1] and bottom < roi_bottom_right[1])
        
        
#     all_human_counts = [];

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             break
        
#         frame_number += 1

#         results = model(frame)
#         frame_h, frame_w, _ = frame.shape
#         detections = results[0].boxes.xyxy.cpu().numpy()  # ดึงข้อมูล bounding boxes
#         classes = results[0].boxes.cls.cpu().numpy()     # ดึงข้อมูล class
#         human_count = 0
#         current_people = []

#         for i, box in enumerate(detections):
#             left, top, right, bottom = map(int, box[:4])
#             cls = int(classes[i])

#             if cls == 0 and is_within_roi(left, top, right, bottom, roi_top_left, roi_bottom_right):  # ตรวจจับเฉพาะคน
#                 current_people.append((left, top, right, bottom))  # เก็บ bounding box ของคนในเฟรมนี้

#                 # Crop เฉพาะบริเวณคนจากเฟรม
#                 person_region = frame[top:bottom, left:right]

#                 # ตรวจจับใบหน้าใน Bounding Box
#                 gray_person = cv2.cvtColor(person_region, cv2.COLOR_BGR2GRAY)
#                 faces = face_cascade.detectMultiScale(gray_person, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

#                 for (fx, fy, fw, fh) in faces:
#                     # เบลอเฉพาะใบหน้า
#                     face_region = person_region[fy:fy+fh, fx:fx+fw]
#                     blurred_face = cv2.GaussianBlur(face_region, (51, 51), 30)
#                     person_region[fy:fy+fh, fx:fx+fw] = blurred_face

#                 # แปะกลับไปยังเฟรมหลัก
#                 frame[top:bottom, left:right] = person_region

#                 # วาด Bounding Box รอบคน
#                 cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
#                 cv2.putText(frame, "Person", (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

#         # นับจำนวนคนใหม่ที่เพิ่มเข้ามาใน ROI
#         for person in current_people:
#             if person not in previous_people:
#                 human_count += 1

#         previous_people = current_people  # อัปเดต bounding box ของเฟรมปัจจุบันไปยังตัวแปร previous_people
        
#         all_human_counts.append(human_count)

#         # แสดงจำนวนคนที่ตรวจจับได้
#         cv2.putText(frame, f"Human Count: {human_count}", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)
        
        
#         cv2.rectangle(frame, roi_top_left, roi_bottom_right, (0, 0, 255), 2)  # วาด ROI

#         # cv2.imshow('YOLOv8 Object Detection - Human Count & Face Blur', frame)

#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break
        
#         # print("Human counts in all frames:", all_human_counts)
        
#         if frame_number % 60 == 0:  # พิมพ์ทุก 60 เฟรม
#             print("Human counts in all frames:", all_human_counts)
        
        
#         # test = sum(all_human_counts)
        
#         # print(test)
#         # cap.release()
#     return all_human_counts[-1] if all_human_counts else 0
    
# # ปิดการเข้าถึงกล้อง
# # cap.release()
# cv2.destroyAllWindows()

# ----------------------------------------------------------------------------------------------------------------------------------------------------------
# Roi with 2 zone 

# import torch
# import cv2
# import numpy as np
# import os
# from ultralytics import YOLO

# # โหลด YOLOv8 pre-trained model
# model = YOLO('yoloModel/yolov8s.pt')  # ใช้โมเดล YOLOv8

# # โหลด Haar Cascade สำหรับตรวจจับใบหน้า
# face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# # เปิดวิดีโอด้วย OpenCV
# def get_human_count(zone_id):
#     # สร้าง path ไปยังไฟล์วิดีโอ
#     zone_id = "vidva.mp4"
#     # zone_id = f"vid_zone_{zone_id}.mp4"
#     # video_path = os.path.join(os.path.dirname(__file__), f"../public/video/{zone_id}")
#     video_path = os.path.join(os.path.dirname(__file__), f"../public/video/{zone_id}")
    
#     if not os.path.exists(video_path):
#         print(f"Video file for zone {zone_id} not found.")
#         return 0  # ถ้าไม่มีวิดีโอ ให้คืนค่า 0
    
#     cap = cv2.VideoCapture(video_path)

#     # กำหนด ROI (Region of Interest) สองพื้นที่
#     # area ROI zone 1
#     # top left (50,50)
#     # bottom right (100,700)
#     # width = 100 - 50 = 50
#     # height = 700 - 50 = 650
#     # area = 50 * 650 = 32,500 pixels
#     roi_areas = {
#                 # เริ่มมุมซ้ายบน,เริ่มมุมซ้ายล่าง
#         "Zone 1": [(50, 50), (100, 700)],   # ROI 1 
#         "Zone 2": [(800, 50), (1500, 700)]  # ROI 2
#     }

#     frame_number = 0
#     human_counts = {zone: [] for zone in roi_areas}  # เก็บจำนวนคนในแต่ละ ROI

#     def is_within_roi(left, top, right, bottom, roi_top_left, roi_bottom_right):
#         return (left > roi_top_left[0] and right < roi_bottom_right[0] and
#                 top > roi_top_left[1] and bottom < roi_bottom_right[1])

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             break
        
#         frame_number += 1
#         results = model(frame)
#         detections = results[0].boxes.xyxy.cpu().numpy()
#         classes = results[0].boxes.cls.cpu().numpy()
        
#         current_counts = {zone: 0 for zone in roi_areas}
        
#         for i, box in enumerate(detections):
#             left, top, right, bottom = map(int, box[:4])
#             cls = int(classes[i])

#             if cls == 0:  # ตรวจจับเฉพาะคน
#                 for zone, (roi_top_left, roi_bottom_right) in roi_areas.items():
#                     if is_within_roi(left, top, right, bottom, roi_top_left, roi_bottom_right):
#                         current_counts[zone] += 1
                        
#                         # วาด Bounding Box
#                         cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
#                         cv2.putText(frame, "Person", (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                        
#                         # Crop เฉพาะบริเวณคนจากเฟรม
#                         person_region = frame[top:bottom, left:right]
#                         gray_person = cv2.cvtColor(person_region, cv2.COLOR_BGR2GRAY)
#                         faces = face_cascade.detectMultiScale(gray_person, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
                        
#                         for (fx, fy, fw, fh) in faces:
#                             face_region = person_region[fy:fy+fh, fx:fx+fw]
#                             blurred_face = cv2.GaussianBlur(face_region, (51, 51), 30)
#                             person_region[fy:fy+fh, fx:fx+fw] = blurred_face
                        
#                         frame[top:bottom, left:right] = person_region
                        
#         # บันทึกจำนวนคนในแต่ละ ROI
#         for zone in roi_areas:
#             human_counts[zone].append(current_counts[zone])

#         # วาด ROI และแสดงจำนวนคน
#         for zone, (roi_top_left, roi_bottom_right) in roi_areas.items():
#             cv2.rectangle(frame, roi_top_left, roi_bottom_right, (0, 0, 255), 2)
#             cv2.putText(frame, f"{zone}: {current_counts[zone]}", (roi_top_left[0], roi_top_left[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

#         cv2.imshow('YOLOv8 Human Detection', frame)
        
#         cv2.waitKey(0) 
        
#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break
        
    
#     cap.release()
#     cv2.destroyAllWindows()
    
#     return {zone: human_counts[zone][-1] if human_counts[zone] else 0 for zone in roi_areas}

# get_human_count(1)


# ----------------------------------------------------------------------------------------------------------------------------------------------------------
# Faster Version

import torch
import cv2
import numpy as np
import os
from ultralytics import YOLO

# โหลด YOLOv8 pre-trained model
model = YOLO('yoloModel/yolov8s.pt') 

# เปิดวิดีโอด้วย OpenCV
def get_human_count(zone_id):
    # สร้าง path ไปยังไฟล์วิดีโอ
    # zone_id = "{zone_id}.mp4"
    video_path = os.path.join(os.path.dirname(__file__), f"../public/video/{zone_id}.mp4")
    print(f"start human count zone {zone_id}")
    
    if not os.path.exists(video_path):
        print(f"Video file {zone_id} not found.")
        return 0  
    
    cap = cv2.VideoCapture(video_path)

    # กำหนด ROI (Region of Interest)
    roi_areas = {
        "Zone 1": [(50, 50), (700, 700)],  
        "Restaurant Zone": [(800, 50), (1500, 700)]
    }

    frame_number = 0
    human_counts = {zone: [] for zone in roi_areas}

    def is_within_roi(left, top, right, bottom, roi_top_left, roi_bottom_right):
        return (left > roi_top_left[0] and right < roi_bottom_right[0] and
                top > roi_top_left[1] and bottom < roi_bottom_right[1])
    
    print(f"before while loop")

    while True:
        print(f"in while loop")
        ret, frame = cap.read()
        if not ret:
            break

        frame_number += 1

        # ข้ามการตรวจจับบางเฟรม เพื่อลดภาระ (เช่น ประมวลผลทุก 5 เฟรม)
        if frame_number % 5 != 0:
            continue

        # 🔻 ลดขนาดภาพให้ YOLO ทำงานเร็วขึ้น
        small_frame = cv2.resize(frame, (640, 360))

        results = model(small_frame)
        detections = results[0].boxes.xyxy.cpu().numpy()
        classes = results[0].boxes.cls.cpu().numpy()

        print(f"before current count")

        current_counts = {zone: 0 for zone in roi_areas}

        for i, box in enumerate(detections):
            left, top, right, bottom = map(int, box[:4])
            cls = int(classes[i])

            if cls == 0:  # ตรวจจับเฉพาะคน
                for zone, (roi_top_left, roi_bottom_right) in roi_areas.items():
                    if is_within_roi(left, top, right, bottom, roi_top_left, roi_bottom_right):
                        current_counts[zone] += 1

        print(f"before roi in while")

        # บันทึกจำนวนคนในแต่ละ ROI
        for zone in roi_areas:
            human_counts[zone].append(current_counts[zone])

        print(f"before mod")

        # แสดงผลแค่ทุกๆ 10 เฟรม
        if frame_number % 10 == 0:
            for zone, (roi_top_left, roi_bottom_right) in roi_areas.items():
                cv2.rectangle(frame, roi_top_left, roi_bottom_right, (0, 0, 255), 2)
                cv2.putText(frame, f"{zone}: {current_counts[zone]}", (roi_top_left[0], roi_top_left[1] - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

            # cv2.imshow('YOLOv8 Human Detection', frame)

        print(f"before break")

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    print(f"before print roi area")

    cap.release()
    cv2.destroyAllWindows()
    
    for zone in roi_areas:
        print(f"zone {zone}: {human_counts[zone][-1] if human_counts[zone] else 0}")

    print(f"success human count")

    return {zone : human_counts[zone][-1] if human_counts[zone] else 0 for zone in roi_areas}
