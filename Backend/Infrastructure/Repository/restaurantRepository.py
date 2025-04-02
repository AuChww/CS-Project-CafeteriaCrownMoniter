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
            zone_id=row[1], 
            restaurant_name=row[2],
            restaurant_location=row[3],
            restaurant_detail=row[4],
            restaurant_rating=row[5],
            total_rating=row[6],
            total_reviews=row[7],
            restaurant_image=row[8],
            current_visitor_count=row[9],
            update_date_time=row[10] 
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
            zone_id=row[1], 
            restaurant_name=row[2],
            restaurant_location=row[3],
            restaurant_detail=row[4],
            restaurant_rating=row[5],
            total_rating=row[6],
            total_reviews=row[7],
            restaurant_image=row[8],
            current_visitor_count=row[9],
            update_date_time=row[10] 
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
                date_time=row[2], 
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
            review_comment=row[4],
            created_time=row[5],  
            update_time=row[6],  
            review_image=row[7]  
        )
        for row in data
    ]
    return reviews


def get_restaurant_image(restaurant_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute("SELECT restaurant_image FROM restaurant WHERE restaurant_id = %s", (restaurant_id,))
    result = cur.fetchone()
    cur.close()
    conn.close()
    
    return result[0] if result else None 


def add_restaurant(zone_id, restaurant_name, restaurant_location, restaurant_detail):
    conn = db_conn()
    cur = conn.cursor()
    restaurant_rating = 0
    total_rating = 0
    total_reviews = 0
    restaurant_image = ''
    current_visitor_count = 0

    cur.execute(
        'INSERT INTO restaurant (zone_id, restaurant_name, restaurant_location, restaurant_detail, restaurant_rating, total_rating, total_reviews, restaurant_image, current_visitor_count) '
        'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING restaurant_id',
        (zone_id, restaurant_name, restaurant_location, restaurant_detail, restaurant_rating, total_rating, total_reviews, restaurant_image, current_visitor_count)
    )
    restaurant_id = cur.fetchone()[0]

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



def update_restaurant_count(human_count_data):
    conn = db_conn()
    cur = conn.cursor()

    for i in range(0, len(human_count_data)):
        restaurant_id, count = human_count_data[i]
        
        if isinstance(restaurant_id, int) and isinstance(count, int):
            cur.execute(
                "UPDATE restaurant SET current_visitor_count = %s WHERE restaurant_id = %s",
                (count, restaurant_id)
            )
        else:
            print(f"Invalid data: restaurant_id={restaurant_id}, count={count}")

    conn.commit()
    cur.close()
    conn.close()
    return True



def delete_restaurant(restaurant_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('DELETE FROM restaurant WHERE restaurant_id = %s', (restaurant_id,))
    deleted = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return deleted
