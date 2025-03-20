import psycopg2
from Infrastructure.db_connection import db_conn
from Domain.entity.zoneEntity import ZoneEntity
from Domain.entity.zoneVisitorHistoryEntity import ZoneVisitorHistoryEntity

def get_total_visitors_by_bar(bar_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT SUM(current_visitor_count) FROM zone WHERE bar_id = %s', (bar_id))
    total = cur.fetchone()[0]
    cur.close()
    conn.close()
    return total if total else 0  # ถ้า NULL ให้คืนค่าเป็น 0


def get_all_zones():
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM zone')
    data = cur.fetchall()
    cur.close()
    conn.close()

    zones = [
        ZoneEntity(
            zone_id=row[0],
            bar_id=row[1],
            zone_name=row[2],
            zone_detail=row[3],
            max_people_in_zone=row[4],
            current_visitor_count=row[5],
            update_date_time=row[6],
            zone_time=row[7],
            zone_image=row[8]
        )
        for row in data
    ]
    return zones

def get_zone_by_id(zone_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM zone WHERE zone_id = %s', (zone_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row:
        return ZoneEntity(
            zone_id=row[0],
            bar_id=row[1],
            zone_name=row[2],
            zone_detail=row[3],
            max_people_in_zone=row[4],
            current_visitor_count=row[5],
            update_date_time=row[6],
            zone_time=row[7],
            zone_image=row[8]
        )
    return None

def get_visitor_history_by_zone_id(zone_id):
    conn = db_conn()
    cur = conn.cursor()
    query = """
        SELECT zone_id, visitor_count, date_time
        FROM zone_visitor_history
        WHERE zone_id = %s
    """
    cur.execute(query, (zone_id,))
    rows = cur.fetchall()
    cur.close()
    conn.close()

    if rows:
        return [
            ZoneVisitorHistoryEntity(
                date_time=row[2],  # date_time corresponds to row[2]
                zone_id=row[0],
                visitor_count=row[1]
            )
            for row in rows
        ]
    return []


def get_restaurant_by_zone_id(zone_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM restaurant WHERE zone_id = %s', (zone_id,))
    data = cur.fetchall()
    cur.close()
    conn.close()

    restaurants = [
        {
            'restaurant_id' : row[0],
            'zone_id' : row[1],  # แก้ไขเป็น zone_id จาก row[1]
            'restaurant_name' : row[2],
            'restaurant_location' : row[3],
            'restaurant_detail' : row[4],
            'restaurant_rating' : row[5],
            'total_rating' : row[6],
            'total_reviews' : row[7],
            'restaurant_image' : row[8],
            'current_visitor_count' : row[9],
            'update_date_time' : row[10] 
        }
        for row in data
    ]
    return restaurants

def get_all_report_by_zone_id(zone_id):
    conn = db_conn()
    cur = conn.cursor()
    query = '''
        SELECT r.report_id, r.zone_id, r.report_type, r.report_message, r.created_time
        FROM report r
        WHERE r.zone_id = %s
    '''
    cur.execute(query, (zone_id,))
    data = cur.fetchall()
    cur.close()
    conn.close()

    reports = [
        {
            'report_id': row[0],
            'zone_id': row[2],
            'report_type': row[4],
            'report_message': row[5],
            'created_time': row[6],
        }
        for row in data
    ]
    return reports

def add_zone(bar_id, zone_name, zone_detail, max_people_in_zone, current_visitor_count, zone_time):
    zone_image = '' 
    current_visitor_count = 0
    update_date_time = None
    
    conn = db_conn()
    cur = conn.cursor()

    cur.execute(
        'INSERT INTO zone (bar_id, zone_name, zone_detail, max_people_in_zone, current_visitor_count, update_date_time, zone_time, zone_image) '
        'VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING zone_id',
        (bar_id, zone_name, zone_detail, max_people_in_zone, current_visitor_count, update_date_time, zone_time, zone_image)
    )
    zone_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return zone_id

def update_zone_image_path(zone_id, file_name):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'UPDATE zone SET zone_image = %s WHERE zone_id = %s',
        (file_name, zone_id)
    )
    conn.commit()
    cur.close()
    conn.close()



def update_zone(zone_id, data):
    conn = db_conn()
    cur = conn.cursor()

    # Check if 'current_visitor_count' exists in the data, if not, set a default value (e.g., 0)
    current_visitor_count = data.get('current_visitor_count', 0)

    cur.execute(
        'UPDATE zone SET zone_name = %s, zone_detail = %s, max_people_in_zone = %s, '
        'zone_time = %s, zone_image = %s, current_visitor_count = %s WHERE zone_id = %s',
        (data.get('zone_name'), data.get('zone_detail'), data.get('max_people_in_zone'),
         data.get('zone_time'), data.get('zone_image'), current_visitor_count, zone_id)
    )

    updated = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()

    return updated


def get_zone_image(zone_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute("SELECT zone_image FROM zone WHERE zone_id = %s", (zone_id,))
    result = cur.fetchone()
    cur.close()
    conn.close()
    
    return result[0] if result else None 


def update_zone_count(zone_id, count, update_date_time):
    """ อัปเดตค่าจำนวนคนที่อยู่ในโซน และอัปเดตเวลาล่าสุด """
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        """
        UPDATE zone 
        SET current_visitor_count = %s, update_date_time = %s 
        WHERE zone_id = %s
        """,
        (count, update_date_time, zone_id)  # ต้องใส่ update_date_time ด้วย
    )
    updated = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return updated


def delete_zone(zone_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('DELETE FROM zone WHERE zone_id = %s', (zone_id,))
    deleted = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return deleted
