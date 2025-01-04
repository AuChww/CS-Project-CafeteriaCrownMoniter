import psycopg2
from Infrastructure.db_connection import db_conn
from Domain.entity.barEntity import BarEntity
from Domain.entity.restaurantEntity import RestaurantEntity
from Domain.entity.reviewEntity import ReviewEntity

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
            total_rating=row[4],
            total_reviews=row[5],
            bar_image=row[6]  # รับข้อมูล bar_image จากฐานข้อมูล
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
            total_rating=row[4],
            total_reviews=row[5],
            bar_image=row[6]  # รับข้อมูล bar_image จากฐานข้อมูล
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

def get_all_reviews_by_bar_id(bar_id):
    conn = db_conn()
    cur = conn.cursor()
    query = '''
        SELECT r.review_id, r.user_id, r.restaurant_id, r.rating, r.comment, r.created_at
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
            comment=row[4],
            created_at=row[5]
        )
        for row in data
    ]
    return reviews

def add_bar(bar_name, bar_location, bar_detail, bar_image=None):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO BAR (bar_name, bar_location, bar_detail, bar_image) VALUES (%s, %s, %s, %s) RETURNING bar_id',
        (bar_name, bar_location, bar_detail, bar_image)
    )
    bar_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return bar_id

def update_bar(bar_id, data):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'UPDATE BAR SET bar_name = %s, bar_location = %s, bar_detail = %s, bar_image = %s WHERE bar_id = %s',
        (data.get('bar_name'), data.get('bar_location'), data.get('bar_detail'), data.get('bar_image'), bar_id)
    )
    updated = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return updated

def delete_bar(bar_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('DELETE FROM BAR WHERE bar_id = %s', (bar_id,))
    deleted = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return deleted
