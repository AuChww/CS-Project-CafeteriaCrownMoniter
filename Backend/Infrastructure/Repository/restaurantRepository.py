import psycopg2
from Infrastructure.db_connection import db_conn
from Domain.entity.restaurantEntity import RestaurantEntity

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
            bar_id=row[1],
            restaurant_name=row[2],
            restaurant_location=row[3],
            restaurant_detail=row[4],
            total_rating=row[5],
            total_reviews=row[6]
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
            bar_id=row[1],
            restaurant_name=row[2],
            restaurant_location=row[3],
            restaurant_detail=row[4],
            total_rating=row[5],
            total_reviews=row[6]
        )
    return None

from Domain.entity.reviewEntity import ReviewEntity

def get_all_reviews_by_restaurant_id(restaurant_id):
    conn = db_conn()
    cur = conn.cursor()
    query = '''
        SELECT review_id, user_id, restaurant_id, rating, comment, created_at
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
            comment=row[4],
            created_at=row[5]
        )
        for row in data
    ]
    return reviews

def add_restaurant(bar_id, restaurant_name, restaurant_location, restaurant_detail):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO RESTAURANT (bar_id, restaurant_name, restaurant_location, restaurant_detail) VALUES (%s, %s, %s, %s) RETURNING restaurant_id',
        (bar_id, restaurant_name, restaurant_location, restaurant_detail)
    )
    restaurant_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return restaurant_id

def update_restaurant(restaurant_id, data):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'UPDATE RESTAURANT SET restaurant_name = %s, restaurant_location = %s, restaurant_detail = %s WHERE restaurant_id = %s',
        (data.get('restaurant_name'), data.get('restaurant_location'), data.get('restaurant_detail'), restaurant_id)
    )
    updated = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return updated

def delete_restaurant(restaurant_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('DELETE FROM RESTAURANT WHERE restaurant_id = %s', (restaurant_id,))
    deleted = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return deleted