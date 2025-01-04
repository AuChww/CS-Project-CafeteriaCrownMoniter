import psycopg2
from Infrastructure.db_connection import db_conn
from Domain.entity.reviewEntity import ReviewEntity

def get_all_reviews():
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM review')
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
            review_image=row[7]     # เพิ่มฟิลด์ review_image
        )
        for row in data
    ]
    return reviews

def get_review_by_id(review_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM review WHERE review_id = %s', (review_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row:
        return ReviewEntity(
            review_id=row[0],
            user_id=row[1],
            restaurant_id=row[2],
            rating=row[3],
            review_comment=row[4],  # แก้ไขเป็น review_comment
            created_time=row[5],    # แก้ไขเป็น created_time
            update_time=row[6],     # แก้ไขเป็น update_time
            review_image=row[7]     # เพิ่มฟิลด์ review_image
        )
    return None

def add_review(user_id, restaurant_id, rating, review_comment, review_image=None):
    conn = db_conn()
    cur = conn.cursor()
    query = '''
        INSERT INTO review (user_id, restaurant_id, rating, comment, review_image)
        VALUES (%s, %s, %s, %s, %s) RETURNING review_id
    '''
    cur.execute(query, (user_id, restaurant_id, rating, review_comment, review_image))
    review_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return review_id

def update_review(review_id, user_id, restaurant_id, rating, review_comment, review_image=None):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(''' 
        UPDATE review SET user_id = %s, restaurant_id = %s, rating = %s, comment = %s, review_image = %s
        WHERE review_id = %s
    ''', (user_id, restaurant_id, rating, review_comment, review_image, review_id))
    updated = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return updated

def delete_review(review_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('DELETE FROM review WHERE review_id = %s', (review_id,))
    deleted = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return deleted
