# Use a Python base image
FROM python:3.12-slim

# Install system dependencies required for OpenCV and Torch
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libx11-dev \
    postgresql-client \ 
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the application files to the container
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# ก๊อป entrypoint script และให้สิทธิ์รันได้
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set environment variables for Flask
ENV FLASK_APP=API/app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=8000

# Expose the port Flask will run on
EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]

# Command to run the Flask application
CMD ["flask", "run"]