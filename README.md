# CS-Project-CafeteriaRecommendation&CrowdMoniterSystem

This system is developed as a **Web Application** with the main feature of displaying the number of users in near real-time in each canteens, cafeteria zone, and restaurant by using YOLO v.8 to detect and count the number of people in the clip to be processed every 1 minute, along with a feature to recommend canteens, cafeteria zones, various restaurants. There are also features to review and star restaurants, user history display system (1 day, 7 days, 30 days) and a system to report location problems to the administrator. The access rights to the system are different according to the user's role. 

This system is developed with **Next.JS**, **Flask**, **YOLO v.8**, **PostgreSQL**, and **Docker** to enable efficient data management and display. 

#### Graduation project in 2025 of Computer Science students, Kasetsart University, Bangkhen KU81 CS36 
- 6410450800 Mr. Chanawut Wuttinan 
- 6410450893 Nawaphon Leelanawalikit

___


ระบบนี้พัฒนาเป็น **Web Application** ที่มีฟีเจอร์หลักในการแสดงจำนวนผู้ใช้ในระดับใกล้เคียงกับเรียลไทม์ ในแต่ละโรงอาหาร, โซนของโรงอาหาร และ ร้านอาหาร ได้โดยใช้ YOLO v.8 ตรวจจับและนับจำนวนผู้คนในคลิปที่จะประมวลผลทุก 1 นาที พร้อมทั้งฟีเจอร์จัดอันดับแนะนำโรงอาหาร, โซนของโรงอาหาร, ร้านอาหารต่างๆ และยังมี ฟีเจอร์การรีวิวและให้ดาวร้านอาหาร, ระบบแสดงประวัติผู้ใช้งาน (1 day, 7 days, 30 days) และ ระบบรายงานปัญหาสถานที่แก่ผู้ดูแลระบบ ทั้งนี้สิทธิ์ในการเข้าถึงระบบแตกต่างกันไปตาม Role ของผู้ใช้งาน

ระบบนี้ถูกพัฒนาด้วย **Next.JS**, **Flask**,**YOLO v.8** , **PostgreSQL**, และ **Docker** เพื่อให้การบริหารจัดการข้อมูลและการแสดงผลเป็นไปอย่างมีประสิทธิภาพ

#### โปรเจ็คจบการศึกษาปี 2568 ของนิสิตวิทยาการคอมพิวเตอร์ ม.เกษตรศาสตร์ บางเขน KU81 CS36
- 6410450800 นายชนาวุฒิ วุฑฒินันท์
- 6410450893 ณวพน ลีลานวลิขิต


## วิธีการ run project
- **ขั้นตอนที่ 1**: ใช้คำสั่งเพื่อ clone โปรเจคจาก GitHub
```
git clone https://github.com/AuChww/CS-Project-CafeteriaRecommendationAndCrowdMoniterSystem.git
``` 

### Backend Set Up

- **ขั้นตอนที่ 2**: ใช้คำสั่ง 
```
cd /Backend
```

- **ขั้นตอนที่ 3**: รันเพื่อสร้าง Docker container และเปิดพอร์ต 8000 โดยจะติดตั้ง Schema และ default data ไว้ให้ด้วย
```
docker-compose up --build
```

- **ขั้นตอนที่ 4**: ใช้คำสั่งเพื่อตรวจสอบว่า dependencies ต่างๆ ถูกติดตั้งใน environment
```
pip freeze
```

### Frontend Set Up

- **ขั้นตอนที่ 5**: ใช้คำสั่ง cd .. เพื่อกลับไป directory หลัก
```
cd ..
```
- **ขั้นตอนที่ 6**: ใช้คำสั่ง เพื่อไปที่ directory frontend
```
cd /Frontend
```

- **ขั้นตอนที่ 7**: ใช้คำสั่ง 
```
npm install
```
