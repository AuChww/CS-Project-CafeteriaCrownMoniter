import psycopg2
from Infrastructure.db_connection import db_conn
from Domain.entity.barEntity import BarEntity
from Domain.entity.restaurantEntity import RestaurantEntity
from Domain.entity.reviewEntity import ReviewEntity
from Domain.entity.zoneEntity import ZoneEntity

def update_bar_visitor_count(bar_id, visitor_count):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('UPDATE bar SET current_visitor_count = %s WHERE bar_id = %s', (visitor_count, bar_id))
    conn.commit()
    cur.close()
    conn.close()


def get_all_bars():
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM bar')
    data = cur.fetchall()
    cur.close()
    conn.close()

    bars = [
        BarEntity(
            bar_id=row[0],
            bar_name=row[1],
            bar_location=row[2],
            bar_detail=row[3],
            current_visitor_count=row[4],
            max_people_in_bar=row[5],  # Mapping to max_people_in_bar from DB
            total_rating=row[6],        # Mapping to total_rating from DB
            total_reviews=row[7],       # Mapping to total_reviews from DB
            bar_image=row[8]            # Mapping to bar_image from DB
        )
        for row in data
    ]
    return bars


def get_bar_by_id(bar_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM bar WHERE bar_id = %s', (bar_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row:
        return BarEntity(
            bar_id=row[0],
            bar_name=row[1],
            bar_location=row[2],
            bar_detail=row[3],
            current_visitor_count=row[4],
            max_people_in_bar=row[5],  # Mapping to max_people_in_bar from DB
            total_rating=row[6],        # Mapping to total_rating from DB
            total_reviews=row[7],       # Mapping to total_reviews from DB
            bar_image=row[8]           # Mapping to bar_image from DB
        )
    return None

def get_all_restaurants_by_bar_id(bar_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM restaurant WHERE bar_id = %s', (bar_id,))
    data = cur.fetchall()
    cur.close()
    conn.close()

    restaurants = [
        RestaurantEntity(
            restaurant_id=row[0],
            zone_id=row[1],  # Mapping to zone_id from DB
            restaurant_name=row[2],
            restaurant_location=row[3],
            restaurant_detail=row[4],
            total_rating=row[5],      # Mapping to total_rating from DB
            total_reviews=row[6],     # Mapping to total_reviews from DB
            restaurant_image=row[7]   # Mapping to restaurant_image from DB
        )
        for row in data
    ]
    return restaurants


def get_all_reviews_by_bar_id(bar_id):
    conn = db_conn()
    cur = conn.cursor()
    query = '''
        SELECT r.review_id, r.user_id, r.restaurant_id, r.rating, r.review_comment, r.created_time
        FROM review r
        JOIN restaurant rest ON r.restaurant_id = rest.restaurant_id
        WHERE rest.bar_id = %s
    '''
    cur.execute(query, (bar_id,))
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
            created_time=row[5]
        )
        for row in data
    ]
    return reviews

def get_all_zones_by_bar_id(bar_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM zone WHERE bar_id = %s', (bar_id,))
    data = cur.fetchall()
    cur.close()
    conn.close()

    zones = [
        ZoneEntity(
            zone_id=row[0],
            bar_id=row[1],
            zone_name=row[2],
            zone_detail=row[3],
            max_people_in_zone=row[4],         # Mapping to max_people_in_zone from DB
            current_visitor_count=row[5],       # Mapping to current_visitor_count from DB
            update_date_time=row[6],            # Mapping to update_date_time from DB
            zone_time=row[7]                    # Mapping to zone_time from DB
        )
        for row in data
    ]
    return zones

def add_bar(bar_name, bar_location, bar_detail, max_people_in_bar):
    
    bar_image = ''  
    print(f"bar_image: {bar_image}")
    
    conn = db_conn()
    cur = conn.cursor()
    total_rating = 0
    total_reviews = 0
    cur.execute(
        'INSERT INTO bar (bar_name, bar_location, bar_detail, max_people_in_bar, total_rating, total_reviews, bar_image) '
        'VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING bar_id',
        (bar_name, bar_location, bar_detail, max_people_in_bar, total_rating, total_reviews, bar_image)
    )
    bar_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return bar_id

def update_bar_image_path(bar_id, file_name):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'UPDATE bar SET bar_image = %s WHERE bar_id = %s',
        (file_name, bar_id)
    )
    conn.commit()
    cur.close()
    conn.close()



def update_bar(bar_id, data):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'UPDATE bar SET bar_name = %s, bar_location = %s, bar_detail = %s, max_people_in_bar = %s, '
        'total_rating = %s, total_reviews = %s, bar_image = %s WHERE bar_id = %s',
        (data.get('bar_name'), data.get('bar_location'), data.get('bar_detail'), data.get('max_people_in_bar'),
         data.get('total_rating'), data.get('total_reviews'), data.get('bar_image'), bar_id)
    )
    updated = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return updated

def delete_bar(bar_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('DELETE FROM bar WHERE bar_id = %s', (bar_id,))
    deleted = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return deleted
