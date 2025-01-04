import psycopg2
from Infrastructure.db_connection import db_conn
from Domain.entity.zoneEntity import ZoneEntity

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
            zone_time=row[7]
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
            zone_time=row[7]
        )
    return None

def get_visitor_history_by_zone_id(zone_id):
    conn = db_conn()
    cur = conn.cursor()
    query = '''
        SELECT v.visitor_id, v.zone_id, v.visitor_count, v.timestamp
        FROM visitor_history v
        WHERE v.zone_id = %s
    '''
    cur.execute(query, (zone_id,))
    data = cur.fetchall()
    cur.close()
    conn.close()

    visitor_history = [
        {
            'visitor_id': row[0],
            'zone_id': row[1],
            'visitor_count': row[2],
            'timestamp': row[3]
        }
        for row in data
    ]
    return visitor_history

def get_restaurant_by_zone_id(zone_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM restaurant WHERE zone_id = %s', (zone_id,))
    data = cur.fetchall()
    cur.close()
    conn.close()

    restaurants = [
        {
            'restaurant_id': row[0],
            'zone_id': row[1],
            'restaurant_name': row[2],
            'restaurant_location': row[3],
            'restaurant_detail': row[4],
            'total_rating': row[5],
            'total_reviews': row[6]
        }
        for row in data
    ]
    return restaurants

def get_all_report_by_zone_id(zone_id):
    conn = db_conn()
    cur = conn.cursor()
    query = '''
        SELECT r.report_id, r.zone_id, r.report_type, r.report_date, r.report_detail
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
            'zone_id': row[1],
            'report_type': row[2],
            'report_date': row[3],
            'report_detail': row[4]
        }
        for row in data
    ]
    return reports

def add_zone(bar_id, zone_name, zone_detail=None, max_people_in_zone=0, current_visitor_count=0, zone_time=None):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO zone (bar_id, zone_name, zone_detail, max_people_in_zone, current_visitor_count, zone_time) '
        'VALUES (%s, %s, %s, %s, %s, %s) RETURNING zone_id',
        (bar_id, zone_name, zone_detail, max_people_in_zone, current_visitor_count, zone_time)
    )
    zone_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return zone_id

def update_zone(zone_id, data):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'UPDATE zone SET zone_name = %s, zone_detail = %s, max_people_in_zone = %s, '
        'current_visitor_count = %s, zone_time = %s WHERE zone_id = %s',
        (data.get('zone_name'), data.get('zone_detail'), data.get('max_people_in_zone'),
         data.get('current_visitor_count'), data.get('zone_time'), zone_id)
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
