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

def add_review(user_id, restaurant_id, rating, review_comment, review_image):
    conn = db_conn()
    cur = conn.cursor()

    # เพิ่มข้อมูลรีวิวใน REVIEW table
    query = '''
        INSERT INTO review (user_id, restaurant_id, rating, review_comment, review_image)
        VALUES (%s, %s, %s, %s, %s) RETURNING review_id
    '''
    cur.execute(query, (user_id, restaurant_id, rating, review_comment, review_image))
    review_id = cur.fetchone()[0]

    # อัพเดต total_rating และ total_reviews ใน RESTAURANT
    cur.execute(
        '''
        UPDATE restaurant
        SET 
            total_rating = restaurant.total_rating + 1, 
            total_reviews = restaurant.total_reviews + 1,
            restaurant_rating = (( restaurant.restaurant_rating * restaurant.total_rating ) + %s) / (restaurant.total_rating + 1)
        WHERE restaurant_id = %s
        ''',
        (rating, restaurant_id)
    )

    # อัพเดต total_rating และ total_reviews ใน BAR ที่เกี่ยวข้อง
    cur.execute(
        '''
        UPDATE bar
        SET 
            total_rating = bar.total_rating + 1, 
            total_reviews = bar.total_reviews + 1,
            bar_rating = (( bar.bar_rating * bar.total_rating )  + %s) / (bar.total_rating + 1)
        FROM zone
        WHERE bar.bar_id = zone.bar_id AND zone.zone_id = (
            SELECT zone_id FROM restaurant WHERE restaurant_id = %s
        )
        ''',
        ( rating, restaurant_id)
    )

    # Commit และปิดการเชื่อมต่อ
    conn.commit()
    cur.close()
    conn.close()

    return review_id


def update_review(review_id, user_id, restaurant_id, rating, review_comment, review_image=None):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(''' 
        UPDATE review SET user_id = %s, restaurant_id = %s, rating = %s, review_comment = %s, review_image = %s
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
