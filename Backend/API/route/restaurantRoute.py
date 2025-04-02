from flask import Blueprint, jsonify, request, send_from_directory
from Application.Service.feature.restaurantService import (
     get_restaurant_by_id_service,
     get_all_restaurants_service,
     get_all_reviews_by_restaurant_id_service,
     get_restaurant_image_service,
     add_restaurant_service,
     update_restaurant_image_service,
     update_restaurant_service,
     update_restaurant_count_service,
     delete_restaurant_service
     
)
from API.route.zoneRoute import (
    is_zone_open
)
from Application.objroi import get_restaurant_human_count
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import pytz 
from apscheduler.triggers.cron import CronTrigger
import os

restaurant_bp = Blueprint('restaurants', __name__)

@restaurant_bp.route('/api/v1/getAllRestaurants', methods=['GET'])
def get_all_restaurants():
    restaurants = get_all_restaurants_service()
    restaurant_list = [
        {
            'restaurant_id': r.restaurant_id,
            'zone_id': r.zone_id,
            'restaurant_name': r.restaurant_name,
            'restaurant_location': r.restaurant_location,
            'restaurant_detail': r.restaurant_detail,
            'restaurant_rating': r.restaurant_rating,
            'total_rating': r.total_rating,
            'total_reviews': r.total_reviews,  # เพิ่ม restaurant_image ในการตอบกลับ
            'restaurant_image': r.restaurant_image,
            'current_visitor_count': r.current_visitor_count,
            'update_date_time' : r.update_date_time,
        }
        for r in restaurants
    ]
    return jsonify({'restaurants': restaurant_list})

@restaurant_bp.route('/api/v1/getRestaurantId/<int:restaurant_id>', methods=['GET'])
def get_restaurant_by_id(restaurant_id):
    restaurant = get_restaurant_by_id_service(restaurant_id)
    if not restaurant:
        return jsonify({'message': 'Restaurant not found'}), 404

    return jsonify({
        'restaurant_id': restaurant.restaurant_id,
        'zone_id': restaurant.zone_id,
        'restaurant_name': restaurant.restaurant_name,
        'restaurant_location': restaurant.restaurant_location,
        'restaurant_detail': restaurant.restaurant_detail,
        'restaurant_rating': restaurant.restaurant_rating,
        'total_rating': restaurant.total_rating,
        'total_reviews': restaurant.total_reviews,  # เพิ่ม restaurant_image ในการตอบกลับ
        'restaurant_image': restaurant.restaurant_image,
        'current_visitor_count': restaurant.current_visitor_count,
        'update_date_time' : restaurant.update_date_time,
    })

@restaurant_bp.route('/api/v1/getReviewByRestaurantId/<int:restaurant_id>', methods=['GET'])
def get_all_reviews_by_restaurant_id(restaurant_id):
    reviews = get_all_reviews_by_restaurant_id_service(restaurant_id)
    review_list = [
        {
            'review_id': r.review_id,
            'user_id': r.user_id,
            'restaurant_id': r.restaurant_id,
            'rating': r.rating,
            'review_comment': r.review_comment,
            'created_time': r.created_time,
            'update_time': r.update_time,
            'review_image': r.review_image 
        }
        for r in reviews
    ]
    return jsonify({'reviews': review_list})

@restaurant_bp.route('/api/v1/addRestaurant', methods=['POST'])
def add_restaurant():

    data = request.form
    zone_id = data.get('zone_id')
    restaurant_name = data.get('restaurant_name')
    restaurant_location = data.get('restaurant_location')
    restaurant_detail = data.get('restaurant_detail')
    restaurant_image = request.files.get('restaurant_image')

    if not all([zone_id, restaurant_name, restaurant_location, restaurant_detail]):
        return jsonify({'message': 'Missing required fields'}), 400

    restaurant_id = add_restaurant_service(zone_id, restaurant_name, restaurant_location, restaurant_detail)  # ส่ง restaurant_image ไปยัง service
    
    if not restaurant_image:
        file_name = f'default.png'
    else :
        file_path = f'public/image/restaurantImages/restaurant{restaurant_id}.png'
        file_name = f'restaurant{restaurant_id}.png'
        restaurant_image.save(file_path)
        print(f"Image saved to {file_path}")
        
    
    update_restaurant_image_service(restaurant_id, file_name) 
    
    return jsonify({'message': 'Restaurant added successfully', 'restaurant_id': restaurant_id}), 201

timezone = pytz.timezone('Asia/Bangkok')

@restaurant_bp.route('/api/v1/updateRestaurantHumanCount/<int:zone_id>', methods=['PATCH'])
def update_restaurant_human_count():
    restaurants = get_all_restaurants_service()
    print(f"update_human_count {datetime.now(timezone)}")

    if not restaurants:
        print(f"[{datetime.now(timezone)}] No restaurants found")
        return

    for i in range(0, len(restaurants), 2):
        restaurant = restaurants[i]
        if not is_zone_open(restaurant.zone_id):
            print(f"[{datetime.now(timezone)}] Restaurant {restaurant.restaurant_id} in Zone {restaurant.zone_id} is closed. Skipping...")
            continue
        
        print(f"Zone {restaurant.zone_id} is Open.")

        restaurant_id_1 = restaurants[i].restaurant_id
        restaurant_id_2 = restaurants[i].restaurant_id + 1

        human_count = get_restaurant_human_count(restaurant_id_1, restaurant_id_2)
        print(f"res human count {restaurant_id_1} and {restaurant_id_2} : {human_count}")

        if isinstance(human_count, list):
            human_count_data = []
            for i in range(0, len(human_count), 2):
                zone_id = human_count[i]
                count = human_count[i + 1]
                human_count_data.append(zone_id)
                human_count_data.append(count)
            
            print(f"success instance restaurant human count {human_count_data}")
        else:
            print(f"[{datetime.now()}] Invalid human count format for restaurant {restaurant_id_1} and {restaurant_id_2}")
            continue

        if not human_count_data:
            print(f"[{datetime.now()}] No valid human count data for restaurant {restaurant_id_1} and {restaurant_id_2}")
            continue

        update_restaurant_count_service(human_count_data)

        print(f"[{datetime.now()}] Updated Restaurant_id {restaurant_id_1} and {restaurant_id_2} with count {human_count_data}")
        print(f"-------------------------------------------------------------------------------------------------")

        
def start_scheduler():
    tz = pytz.timezone('Asia/Bangkok')
    now = datetime.now(tz)
    
    next_run = (now + timedelta(hours=0)).replace(minute=1, second=0, microsecond=0)
    delay = (next_run - now).total_seconds()

    print(f"Current time: {now}")
    print(f"Next run at: {next_run}")
    print(f"Delay until next run: {delay} seconds")

    scheduler = BackgroundScheduler(timezone=tz)

    update_restaurant_human_count()
    scheduler.add_job(update_restaurant_human_count, "cron", minute="*/1", timezone=tz, start_date=now)

    scheduler.start()

start_scheduler()


IMAGE_FOLDER = 'public/image/restaurantImages'

@restaurant_bp.route('/api/v1/getRestaurantImage/<string:file_name>', methods=['GET'])
def get_image_url(file_name):
    # สร้างเส้นทางเต็มของไฟล์
    file_path = os.path.join(IMAGE_FOLDER, file_name)

    # ตรวจสอบว่าไฟล์มีอยู่หรือไม่
    if not os.path.isfile(file_path):
        # ถ้าไม่พบไฟล์ให้ใช้ชื่อ default
        file_name = 'default.png'
    
    # สร้าง URL ที่จะส่งกลับ
    image_url = f"http://localhost:8000/public/image/restaurantImages/{file_name}"

    return jsonify({"url": image_url})


@restaurant_bp.route('/public/image/restaurantImages/<path:file_name>')
def serve_actual_image(file_name):
    image_directory = os.path.join(os.getcwd(), "public", "image", "restaurantImages")
    return send_from_directory(image_directory, file_name)



@restaurant_bp.route('/api/v1/updateRestaurant/<int:restaurant_id>', methods=['PATCH'])
def update_restaurant(restaurant_id):
    data = request.form.to_dict()  
    restaurant_image = request.files.get('restaurant_image')


    restaurant_id = data.get('restaurant_id')
    restaurant_name = data.get('restaurant_name')
    restaurant_detail = data.get('restaurant_detail')
    restaurant_location = data.get('restaurant_location')
    updated = update_restaurant_service(restaurant_id, data)  
    
    previous_file_name = get_restaurant_image_service(restaurant_id)
    
    file_name = f'restaurant{restaurant_id}.png'
    file_path = os.path.join('public', 'image', 'restaurantImages', file_name)
    if restaurant_image:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)  # ลบไฟล์เก่า
                print(f"Old image {file_path} deleted.")
            except Exception as e:
                print(f"Error deleting old image: {e}")

        try:
            restaurant_image.save(file_path)  # บันทึกไฟล์ใหม่
            print(f"New image saved to {file_path}")
        except Exception as e:
            print(f"Error saving image: {e}")
            return jsonify({'message': 'Failed to save image'}), 500
    else:
        file_name = previous_file_name if previous_file_name else 'default.png'  # ถ้าไม่มีภาพใหม่ ให้ใช้ default.png

    # อัปเดตชื่อไฟล์ภาพในข้อมูล
    data['restaurant_image'] = file_name
    
    # updated = update_restaurant_service(restaurant_id, data)
    
    # อัปเดตข้อมูล restaurant_id ในฐานข้อมูล (ถ้าจำเป็น)
    update_restaurant_image_service(restaurant_id, file_name)  # เพิ่ม
    
    
    if not updated:
        return jsonify({'message': 'Restaurant not found'}), 404

    return jsonify({'message': 'Restaurant updated successfully'})

@restaurant_bp.route('/api/v1/deleteRestaurant/<int:restaurant_id>', methods=['DELETE'])
def delete_restaurant(restaurant_id):
    deleted = delete_restaurant_service(restaurant_id)
    if not deleted:
        return jsonify({'message': 'Restaurant not found'}), 404

    return jsonify({'message': 'Restaurant deleted successfully'})
