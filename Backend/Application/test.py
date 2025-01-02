import torch
import cv2

# โหลด YOLOv5 pre-trained model (ใช้ "yolov5s" model ที่เร็วสุดและขนาดเล็กสุด)
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

# เปิดการเข้าถึงกล้อง (0 หมายถึงกล้องหลักของเครื่อง)
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()  # อ่านเฟรมจากกล้อง
    if not ret:
        print("Failed to grab frame")
        break

    # ตรวจจับในแต่ละเฟรมจากกล้อง
    results = model(frame)

    # แสดงผลลัพธ์ในภาพ (เฟรมปัจจุบัน) พร้อม bounding boxes
    results.render()  # วาด bounding boxes ในเฟรม

    # ตรวจสอบว่าเฟรมนี้มีมนุษย์ (class 0 คือ "person") กี่คน
    # results.xywh[0] จะเป็น array ของข้อมูลที่เก็บผลลัพธ์
    # columns: [x_center, y_center, width, height, confidence, class_id]
    humans = results.xywh[0][results.xywh[0][:, -1] == 0]  # class_id 0 คือ "person"
    num_humans = len(humans)  # นับจำนวนมนุษย์ที่ตรวจพบ

    # แสดงจำนวนมนุษย์ที่ตรวจพบบนเฟรม
    cv2.putText(frame, f'Single: {num_humans}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # แสดงผลวิดีโอที่ตรวจจับแล้ว
    cv2.imshow('YOLOv5 Human Detection', frame)

    # กด 'q' เพื่อออกจากการดูวิดีโอ
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# ปิดหน้าต่างหลังจากจบ
cap.release()
cv2.destroyAllWindows()
