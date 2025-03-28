import psycopg2
from Infrastructure.db_connection import db_conn
from Domain.entity.reportEntity import ReportEntity

def get_all_reports():
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM report')
    data = cur.fetchall()
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
        for row in data
    ]
    return reports

def get_report_by_id(report_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM report WHERE report_id = %s', (report_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row:
        return ReportEntity(
            report_id=row[0],
            user_id=row[1],
            zone_id=row[2],
            report_status=row[3],
            report_type=row[4],
            report_message=row[5],
            created_time=row[6],
            report_image=row[7]  # เพิ่มฟิลด์ report_image
        )
    return None

def add_report(user_id, zone_id, report_status, report_type, report_message=None):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO report (user_id, zone_id, report_status, report_type, report_message) VALUES (%s, %s, %s, %s, %s) RETURNING report_id',
        (user_id, zone_id, report_status, report_type, report_message)
    )
    report_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return report_id

def update_report(report_id, data):
    conn = db_conn()
    cur = conn.cursor()

    # ตรวจสอบว่า report_image มีอยู่ใน data หรือไม่
    report_image = data.get('report_image', None)

    if report_image:
        cur.execute(
            'UPDATE report SET report_status = %s, report_type = %s, report_message = %s, report_image = %s WHERE report_id = %s',
            (data.get('report_status'), data.get('report_type'), data.get('report_message'), report_image, report_id)
        )
    else:
        cur.execute(
            'UPDATE report SET report_status = %s, report_type = %s, report_message = %s WHERE report_id = %s',
            (data.get('report_status'), data.get('report_type'), data.get('report_message'), report_id)
        )

    updated = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return updated

def delete_report(report_id):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('DELETE FROM report WHERE report_id = %s', (report_id,))
    deleted = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return deleted

def update_report_image(report_id, file_name):
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        'UPDATE report SET report_image = %s WHERE report_id = %s',
        (file_name, report_id)
    )
    conn.commit()
    cur.close()
    conn.close()
