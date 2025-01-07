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
            visitor_history_id=row[0],
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
            VisitorHistoryEntity(
                date_time=row[2],  # date_time corresponds to row[2]
                zone_id=row[0],
                visitor_count=row[1]
            )
            for row in rows
        ]
    return []


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
