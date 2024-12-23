from Infrastructure.db_connection import db_conn
from Domain.entity.userEntity import UserEntity
from Domain.entity.reviewEntity import ReviewEntity

def get_all_users():
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM "USER"')
    rows = cur.fetchall()
    cur.close()
    conn.close()

    users = [
        UserEntity(
            user_id=row[0],
            user_image=row[1],
            username=row[2],
            password=row[3],
            email=row[4],
            role=row[5]
        )
        for row in rows
    ]
    return users

def get_user_by_id(user_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM "USER" WHERE user_id = %s', (user_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row:
        return UserEntity(
            user_id=row[0],
            user_image=row[1],
            username=row[2],
            password=row[3],
            email=row[4],
            role=row[5]
        )
    return None

def get_reviews_by_user_id(user_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM REVIEW WHERE user_id = %s', (user_id,))
    rows = cur.fetchall()
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
        for row in rows
    ]
    return reviews

def add_user(username, email, password, role, user_image=None):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO "USER" (username, email, password, role, user_image) VALUES (%s, %s, %s, %s, %s) RETURNING user_id',
        (username, email, password, role, user_image)
    )
    user_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return user_id

def update_user(user_id, data):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'UPDATE "USER" SET username = %s, email = %s, role = %s, user_image = %s WHERE user_id = %s',
        (data.get('username'), data.get('email'), data.get('role'), data.get('user_image'), user_id)
    )
    updated = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return updated

def delete_user(user_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('DELETE FROM "USER" WHERE user_id = %s', (user_id,))
    deleted = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return deleted
