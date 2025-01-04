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


import torch
import cv2
import numpy as np
from ultralytics import YOLO

# โหลด YOLOv8 pre-trained model
model = YOLO('yoloModel/yolov8s.pt')  # ใช้โมเดล YOLOv8

# โหลด Haar Cascade สำหรับตรวจจับใบหน้า
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# เปิดการเข้าถึงกล้อง
cap = cv2.VideoCapture(0)

# กำหนดพื้นที่ที่ต้องการนับ (ROI)
roi_top_left = (50, 50)  # จุดมุมบนซ้าย
roi_bottom_right = (1500, 1500)  # จุดมุมล่างขวา

# ตัวแปรนับจำนวนคนใน ROI
human_count = 0
previous_people = []

# ฟังก์ชันตรวจสอบว่าคนอยู่ในพื้นที่ ROI หรือไม่
def is_within_roi(left, top, right, bottom, roi_top_left, roi_bottom_right):
    return (left > roi_top_left[0] and right < roi_bottom_right[0] and
            top > roi_top_left[1] and bottom < roi_bottom_right[1])

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame)
    frame_h, frame_w, _ = frame.shape
    detections = results[0].boxes.xyxy.cpu().numpy()  # ดึงข้อมูล bounding boxes
    classes = results[0].boxes.cls.cpu().numpy()     # ดึงข้อมูล class
    human_count = 0
    current_people = []

    for i, box in enumerate(detections):
        left, top, right, bottom = map(int, box[:4])
        cls = int(classes[i])

        if cls == 0 and is_within_roi(left, top, right, bottom, roi_top_left, roi_bottom_right):  # ตรวจจับเฉพาะคน
            current_people.append((left, top, right, bottom))  # เก็บ bounding box ของคนในเฟรมนี้

            # Crop เฉพาะบริเวณคนจากเฟรม
            person_region = frame[top:bottom, left:right]

            # ตรวจจับใบหน้าใน Bounding Box
            gray_person = cv2.cvtColor(person_region, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray_person, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

            for (fx, fy, fw, fh) in faces:
                # เบลอเฉพาะใบหน้า
                face_region = person_region[fy:fy+fh, fx:fx+fw]
                blurred_face = cv2.GaussianBlur(face_region, (51, 51), 30)
                person_region[fy:fy+fh, fx:fx+fw] = blurred_face

            # แปะกลับไปยังเฟรมหลัก
            frame[top:bottom, left:right] = person_region

            # วาด Bounding Box รอบคน
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
            cv2.putText(frame, "Person", (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # นับจำนวนคนใหม่ที่เพิ่มเข้ามาใน ROI
    for person in current_people:
        if person not in previous_people:
            human_count += 1

    previous_people = current_people  # อัปเดต bounding box ของเฟรมปัจจุบันไปยังตัวแปร previous_people

    # แสดงจำนวนคนที่ตรวจจับได้
    cv2.putText(frame, f"Human Count: {human_count}", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)
    cv2.rectangle(frame, roi_top_left, roi_bottom_right, (0, 255, 0), 2)  # วาด ROI

    cv2.imshow('YOLOv8 Object Detection - Human Count & Face Blur', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# ปิดการเข้าถึงกล้อง
cap.release()
cv2.destroyAllWindows()





