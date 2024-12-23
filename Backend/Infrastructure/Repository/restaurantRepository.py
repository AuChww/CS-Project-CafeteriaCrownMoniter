from Infrastructure.db_connection import SessionLocal
from Domain.entity.restaurantEntity import Restaurant
from Domain.entity.reviewEntity import Review

class RestaurantRepository:
    def fetch_all_restaurants(self):
        db = SessionLocal()
        try:
            restaurants = db.query(Restaurant).all()
            return [r.as_dict() for r in restaurants]
        finally:
            db.close()

    def fetch_all_reviews_by_restaurant_id(self, restaurant_id):
        db = SessionLocal()
        try:
            reviews = db.query(Review).filter(Review.restaurant_id == restaurant_id).all()
            return [r.as_dict() for r in reviews]
        finally:
            db.close()
