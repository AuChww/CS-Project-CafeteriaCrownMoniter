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
            comment=row[4],
            created_at=row[5]
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
            comment=row[4],
            created_at=row[5]
        )
    return None

def add_review(user_id, restaurant_id, rating, comment):
    conn = db_conn()
    cur = conn.cursor()
    query = '''
        INSERT INTO review (user_id, restaurant_id, rating, comment)
        VALUES (%s, %s, %s, %s) RETURNING review_id
    '''
    cur.execute(query, (user_id, restaurant_id, rating, comment))
    review_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return review_id
