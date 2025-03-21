from Infrastructure.db_connection import db_conn
from Domain.entity.userEntity import UserEntity
from Domain.entity.reviewEntity import ReviewEntity
from Domain.entity.reportEntity import ReportEntity
import os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
UPLOAD_FOLDER = '/path/to/your/upload/folder'  # Set the appropriate path for your server

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_image(file):
    try:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            return filename
        else:
            print("Invalid file format.")
            return None
    except Exception as e:
        print(f"Error saving image: {e}")
        return None


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
            role=row[4],
            email=row[5],
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
            role=row[4],
            email=row[5],
        )
    return None

def get_all_reports_by_user_id(user_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM report WHERE user_id = %s', (user_id,))
    rows = cur.fetchall()
    cur.close()
    conn.close()

    reports = [
        ReportEntity(
            report_id=row[0],
            user_id=row[1],
            zone_id=row[2],
            report_status=row[3],
            report_type=row[4],
            report_message=row[5],
            created_time=row[6],
            report_image=row[7]  # เพิ่มฟิลด์ report_image
        )
        for row in rows
    ]
    return reports

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

def get_user_by_username(username):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM "USER" WHERE username = %s', (username,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row:
        return UserEntity(
            user_id=row[0],
            user_image=row[1],
            username=row[2],
            password=row[3],
            role=row[4],
            email=row[5],
        )
    return None


def add_user(username, email, password, role, user_image=None):
    conn = db_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            '''
            INSERT INTO "USER" (username, email, password, role, user_image)
            VALUES (%s, %s, %s, %s, %s) RETURNING user_id
            ''',
            (username, email, password, role, user_image)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        return user_id
    except Exception as e:
        conn.rollback()
        print(f"Error adding user: {e}")
        return None
    finally:
        cur.close()
        conn.close()


def update_user(user_id, data):
    conn = db_conn()
    cur = conn.cursor()
    print("Debug: Data received ->", data)
    
    username = data.get('username')
    email = data.get('email')
    user_image = data.get('user_image')
    
    print(f"Debug: username={username}, email={email}, user_image={user_image}")

    cur.execute(
        'UPDATE "USER" SET username = %s, email = %s, user_image = %s WHERE user_id = %s',
        (username, email, user_image, user_id)
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


def update_user_image_path(user_id, file_name):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'UPDATE "USER" SET user_image = %s WHERE user_id = %s',
        (file_name, user_id)
    )
    conn.commit()
    cur.close()
    conn.close()



def get_user_image(user_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT user_image FROM "USER" WHERE user_id = %s', (user_id,))
    result = cur.fetchone()
    cur.close()
    conn.close()
    
    return result[0] if result else None  # คืนค่า file_name ถ้ามีข้อมูล
