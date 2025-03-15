import psycopg2
from Infrastructure.db_connection import db_conn
from Domain.entity.restaurantEntity import RestaurantEntity
from Domain.entity.reviewEntity import ReviewEntity
from Domain.entity.restaurantVisitorHistoryEntity import RestaurantVisitorHistoryEntity

def get_all_restaurants():
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM restaurant')
    data = cur.fetchall()
    cur.close()
    conn.close()

    restaurants = [
        RestaurantEntity(
            restaurant_id=row[0],
            zone_id=row[1],  # แก้ไขเป็น zone_id จาก row[1]
            restaurant_name=row[2],
            restaurant_location=row[3],
            restaurant_detail=row[4],
            total_rating=row[5],
            total_reviews=row[6],
            restaurant_image=row[7],
            current_visitor_count=row[8],
            update_date_time=row[9]  # เพิ่มฟิลด์ restaurant_image
        )
        for row in data
    ]
    return restaurants

def get_restaurant_by_id(restaurant_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM restaurant WHERE restaurant_id = %s', (restaurant_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row:
        return RestaurantEntity(
            restaurant_id=row[0],
            zone_id=row[1],  # แก้ไขเป็น zone_id จาก row[1]
            restaurant_name=row[2],
            restaurant_location=row[3],
            restaurant_detail=row[4],
            total_rating=row[5],
            total_reviews=row[6],
            restaurant_image=row[7],
            current_visitor_count=row[8],
            update_date_time=row[9]  # เพิ่มฟิลด์ restaurant_image
        )
    return None

def get_visitor_history_by_restaurant_id(restaurant_id):
    conn = db_conn()
    cur = conn.cursor()
    query = """
        SELECT restaurant_id, visitor_count, date_time
        FROM restaurant_visitor_history
        WHERE restaurant_id = %s
    """
    cur.execute(query, (restaurant_id,))
    rows = cur.fetchall()
    cur.close()
    conn.close()

    if rows:
        return [
            RestaurantVisitorHistoryEntity(
                date_time=row[2],  # date_time corresponds to row[2]
                restaurant_id=row[0],
                visitor_count=row[1]
            )
            for row in rows
        ]
    return []

def get_all_reviews_by_restaurant_id(restaurant_id):
    conn = db_conn()
    cur = conn.cursor()
    query = '''
        SELECT review_id, user_id, restaurant_id, rating, review_comment, created_time, update_time, review_image
        FROM review
        WHERE restaurant_id = %s
    '''
    cur.execute(query, (restaurant_id,))
    data = cur.fetchall()
    cur.close()
    conn.close()

    reviews = [
        ReviewEntity(
            review_id=row[0],
            user_id=row[1],
            restaurant_id=row[2],
            rating=row[3],
            review_comment=row[4],  # แก้ไขเป็น review_comment
            created_time=row[5],    # แก้ไขเป็น created_time
            update_time=row[6],     # แก้ไขเป็น update_time
            review_image=row[7]  
        )
        for row in data
    ]
    return reviews


def add_restaurant(zone_id, restaurant_name, restaurant_location, restaurant_detail):
    conn = db_conn()
    cur = conn.cursor()
    restaurant_rating = 0
    total_rating = 0
    total_reviews = 0
    restaurant_image = ''

    # Insert into the RESTAURANT table and return restaurant_id
    cur.execute(
        'INSERT INTO restaurant (zone_id, restaurant_name, restaurant_location, restaurant_detail, restaurant_rating, total_rating, total_reviews, restaurant_image) '
        'VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING restaurant_id',
        (zone_id, restaurant_name, restaurant_location, restaurant_detail, restaurant_rating, total_rating, total_reviews, restaurant_image)
    )
    restaurant_id = cur.fetchone()[0]

    # Commit the transaction and close cursor and connection
    conn.commit()
    cur.close()
    conn.close()

    return restaurant_id

def update_restaurant_image_path(restaurant_id, file_name):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'UPDATE restaurant SET restaurant_image = %s WHERE restaurant_id = %s',
        (file_name, restaurant_id)
    )
    conn.commit()
    cur.close()
    conn.close()

def update_restaurant(restaurant_id, data):
    conn = db_conn()
    cur = conn.cursor()
    
    # ตรวจสอบว่า restaurant_image มีอยู่ใน data หรือไม่
    restaurant_image = data.get('restaurant_image', None)

    if restaurant_image:
        cur.execute(
            'UPDATE restaurant SET restaurant_name = %s, restaurant_location = %s, restaurant_detail = %s, restaurant_image = %s WHERE restaurant_id = %s',
            (data.get('restaurant_name'), data.get('restaurant_location'), data.get('restaurant_detail'), restaurant_image, restaurant_id)
        )
    else:
        cur.execute(
            'UPDATE restaurant SET restaurant_name = %s, restaurant_location = %s, restaurant_detail = %s WHERE restaurant_id = %s',
            (data.get('restaurant_name'), data.get('restaurant_location'), data.get('restaurant_detail'), restaurant_id)
        )
    
    updated = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return updated

def update_restaurant_count(restaurant_id, count):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        "UPDATE restaurant SET current_visitor_count = %s WHERE restaurant_id = %s",
        (count, restaurant_id)  # count ต้องเป็น int ที่ส่งไปที่นี่
    )
    updated = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return updated

def delete_restaurant(restaurant_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('DELETE FROM restaurant WHERE restaurant_id = %s', (restaurant_id,))
    deleted = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return deleted
