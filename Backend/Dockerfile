# ใช้ Python 3.12 slim เป็น base image
FROM python:3.12-slim

# ติดตั้ง dependencies ที่จำเป็นสำหรับการคอมไพล์ psycopg2
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# ตั้งค่า working directory ใน container
WORKDIR /app

# ติดตั้งโมดูลทั้งหมดที่ระบุใน Dockerfile
RUN pip install --no-cache-dir \
    annotated-types==0.7.0 \
    anyio==4.7.0 \
    click==8.1.7 \
    colorama==0.4.6 \
    fastapi==0.115.6 \
    h11==0.14.0 \
    idna==3.10 \
    psycopg2==2.9.10 \
    pydantic==2.10.4 \
    pydantic_core==2.27.2 \
    sniffio==1.3.1 \
    starlette==0.41.3 \
    typing_extensions==4.12.2 \
    uvicorn==0.34.0

# คัดลอกโฟลเดอร์ API ไปยัง container
COPY ./API /app/API

# คำสั่งให้เริ่ม server
CMD ["uvicorn", "API.app:app", "--host", "0.0.0.0", "--port", "8000"]
