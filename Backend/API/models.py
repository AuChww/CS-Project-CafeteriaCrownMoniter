from Infrastructure.db_connection import db

class Bar(db.Model):
    __tablename__ = 'BAR'

    bar_id = db.Column(db.Integer, primary_key=True)
    bar_name = db.Column(db.String(255), nullable=False)
    bar_location = db.Column(db.String, nullable=False)
    bar_detail = db.Column(db.String)
    total_rating = db.Column(db.Integer, default=0)
    total_reviews = db.Column(db.Integer, default=0)

    def __init__(self, bar_name, bar_location, bar_detail=None):
        self.bar_name = bar_name
        self.bar_location = bar_location
        self.bar_detail = bar_detail

    def as_dict(self):
        return {
            "bar_id": self.bar_id,
            "bar_name": self.bar_name,
            "bar_location": self.bar_location,
            "bar_detail": self.bar_detail,
            "total_rating": self.total_rating,
            "total_reviews": self.total_reviews
        }
