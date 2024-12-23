from Infrastructure.Repository.restaurantRepository import RestaurantRepository

class RestaurantService:
    def __init__(self):
        self.repository = RestaurantRepository()

    def get_all_restaurants(self):
        return self.repository.fetch_all_restaurants()

    def get_all_reviews_by_restaurant_id(self, restaurant_id):
        return self.repository.fetch_all_reviews_by_restaurant_id(restaurant_id)
