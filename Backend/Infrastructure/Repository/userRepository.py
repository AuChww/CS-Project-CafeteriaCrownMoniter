from Domain.entity.userEntity import User
from Domain.entity.reviewEntity import Review
from Infrastructure.db_connection import get_db_connection

class UserRepository:
    def __init__(self):
        self.connection = get_db_connection()

    def get_all_users(self):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM USER")
        rows = cursor.fetchall()
        return [User(*row) for row in rows]

    def get_reviews_by_user_id(self, user_id):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM REVIEW WHERE user_id = %s", (user_id,))
        rows = cursor.fetchall()
        return [Review(*row) for row in rows]
