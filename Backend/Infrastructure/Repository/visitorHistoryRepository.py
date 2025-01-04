import psycopg2
from Infrastructure.db_connection import db_conn
from Domain.entity.visitorHistoryEntity import VisitorHistoryEntity

def get_all_visitor_histories():
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM visitor_history')
    data = cur.fetchall()
    cur.close()
    conn.close()

    visitor_histories = [
        VisitorHistoryEntity(
            date_time=row[0],
            zone_id=row[1],
            visitor_count=row[2]
        )
        for row in data
    ]
    return visitor_histories

def get_visitor_history_by_id(visitor_history_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM visitor_history WHERE visitor_history_id = %s', (visitor_history_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row:
        return VisitorHistoryEntity(
            date_time=row[0],
            zone_id=row[1],
            visitor_count=row[2]
        )
    return None

def add_visitor_history(date_time, zone_id, visitor_count):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO visitor_history (date_time, zone_id, visitor_count) VALUES (%s, %s, %s) RETURNING visitor_history_id',
        (date_time, zone_id, visitor_count)
    )
    visitor_history_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return visitor_history_id

def update_visitor_history(visitor_history_id, data):
    conn = db_conn()
    cur = conn.cursor()
    
    cur.execute(
        'UPDATE visitor_history SET date_time = %s, zone_id = %s, visitor_count = %s WHERE visitor_history_id = %s',
        (data.get('date_time'), data.get('zone_id'), data.get('visitor_count'), visitor_history_id)
    )

    updated = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return updated

def delete_visitor_history(visitor_history_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('DELETE FROM visitor_history WHERE visitor_history_id = %s', (visitor_history_id,))
    deleted = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return deleted
