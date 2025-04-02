import psycopg2
from Infrastructure.db_connection import db_conn
from Domain.entity.restaurantVisitorHistoryEntity import RestaurantVisitorHistoryEntity

def get_all_restaurant_visitor_histories():
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM restaurant_visitor_history')
    data = cur.fetchall()
    cur.close()
    conn.close()

    visitor_histories = [
        RestaurantVisitorHistoryEntity(
            restaurant_visitor_history_id=row[0],
            date_time=row[1],
            restaurant_id=row[2],
            visitor_count=row[3]
        )
        for row in data
    ]
    return visitor_histories

def get_visitor_history_by_restaurant_id(restaurant_id):
    conn = db_conn()
    cur = conn.cursor()
    query = """
        SELECT restaurant_id, visitor_count, date_time
        FROM restaurant_visitor_history
        WHERE restaurant_id = %s
    """
    cur.execute(query, (restaurant_id,))
    rows = cur.fetchall()
    cur.close()
    conn.close()

    if rows:
        return [
            RestaurantVisitorHistoryEntity(
                restaurant_visitor_history_id=row[0],
                date_time=row[1],
                restaurant_id=row[2],
                visitor_count=row[3]
            )
            for row in rows
        ]
    return []


def add_restaurant_visitor_history(date_time, restaurant_id, visitor_count):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO restaurant_visitor_history (date_time, restaurant_id, visitor_count) VALUES (%s, %s, %s) RETURNING restaurant_visitor_history_id',
        (date_time, restaurant_id, visitor_count)
    )
    restaurant_visitor_history_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return restaurant_visitor_history_id

def update_restaurant_visitor_history(restaurant_visitor_history_id, data):
    conn = db_conn()
    cur = conn.cursor()
    
    cur.execute(
        'UPDATE restaurant_visitor_history SET date_time = %s, restaurant_id = %s, visitor_count = %s WHERE restaurant_visitor_history_id = %s',
        (data.get('date_time'), data.get('restaurant_id'), data.get('visitor_count'), restaurant_visitor_history_id)
    )

    updated = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return updated

def delete_restaurant_visitor_history(restaurant_visitor_history_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('DELETE FROM restaurant_visitor_history WHERE restaurant_visitor_history_id = %s', (restaurant_visitor_history_id,))
    deleted = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return deleted
