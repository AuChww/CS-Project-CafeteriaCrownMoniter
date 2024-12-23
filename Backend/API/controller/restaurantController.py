from flask_restx import Namespace, Resource
from Application.Service.feature.restaurantService import RestaurantService

restaurant_ns = Namespace("Restaurant", description="Operations related to restaurants")

@restaurant_ns.route("/getAllRestaurant")
class GetAllRestaurant(Resource):
    def get(self):
        service = RestaurantService()
        result = service.get_all_restaurants()
        return result, 200

@restaurant_ns.route("/getAllReviewByRestaurantId/<int:restaurant_id>")
class GetAllReviewByRestaurantId(Resource):
    def get(self, restaurant_id):
        service = RestaurantService()
        result = service.get_all_reviews_by_restaurant_id(restaurant_id)
        return result, 200
