# ใช้ Python 3.12 slim เป็น base image
FROM python:3.12-slim

# ติดตั้ง dependencies ที่จำเป็นสำหรับการคอมไพล์ psycopg2
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# ตั้งค่า working directory ใน container
WORKDIR /app

# คัดลอกไฟล์ requirements.txt ไปยัง container
COPY requirements.txt /app/requirements.txt

# ติดตั้ง dependencies จาก requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# คัดลอกโฟลเดอร์ API ไปยัง container
COPY ./API /app/API

# คำสั่งให้เริ่ม server
CMD ["flask", "run", "--host=0.0.0.0", "--port=8000"]
