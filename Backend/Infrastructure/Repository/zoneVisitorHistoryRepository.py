import psycopg2
from Infrastructure.db_connection import db_conn
from Domain.entity.zoneVisitorHistoryEntity import ZoneVisitorHistoryEntity

def get_all_zone_visitor_histories():
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM zone_visitor_history')
    data = cur.fetchall()
    cur.close()
    conn.close()

    visitor_histories = [
        ZoneVisitorHistoryEntity(
            zone_visitor_history_id=row[0],
            date_time=row[1],
            zone_id=row[2],
            visitor_count=row[3]
        )
        for row in data
    ]
    return visitor_histories

def get_visitor_history_by_zone_id(zone_id):
    conn = db_conn()
    cur = conn.cursor()
    query = """
        SELECT zone_id, visitor_count, date_time
        FROM visitor_history
        WHERE zone_id = %s
    """
    cur.execute(query, (zone_id,))
    rows = cur.fetchall()
    cur.close()
    conn.close()

    if rows:
        return [
            ZoneVisitorHistoryEntity(
                date_time=row[2], 
                zone_id=row[0],
                visitor_count=row[1]
            )
            for row in rows
        ]
    return []


def add_zone_visitor_history(date_time, zone_id, visitor_count):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO zone_visitor_history (date_time, zone_id, visitor_count) VALUES (%s, %s, %s) RETURNING zone_visitor_history_id',
        (date_time, zone_id, visitor_count)
    )
    zone_visitor_history_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return zone_visitor_history_id

def update_zone_visitor_history(zone_visitor_history_id, data):
    conn = db_conn()
    cur = conn.cursor()
    
    cur.execute(
        'UPDATE zone_visitor_history SET date_time = %s, zone_id = %s, visitor_count = %s WHERE zone_visitor_history_id = %s',
        (data.get('date_time'), data.get('zone_id'), data.get('visitor_count'), zone_visitor_history_id)
    )

    updated = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return updated

def delete_zone_visitor_history(zone_visitor_history_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('DELETE FROM zone_visitor_history WHERE zone_visitor_history_id = %s', (zone_visitor_history_id,))
    deleted = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return deleted
