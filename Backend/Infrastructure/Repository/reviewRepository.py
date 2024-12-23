from Infrastructure.db_connection import db
from Domain.entity.reviewEntity import Review

class ReviewRepository:
    @staticmethod
    def get_all_reviews():
        query = "SELECT * FROM REVIEW"
        result = db.execute(query)
        return result.fetchall()

    @staticmethod
    def get_reviews_by_bar(bar_id):
        query = f"SELECT * FROM REVIEW WHERE bar_id = {bar_id}"
        result = db.execute(query)
        return result.fetchall()
