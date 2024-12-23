from flask_restx import Namespace, Resource, fields

# Create a namespace for Restaurants
api = Namespace('restaurants', description='Restaurant-related operations')

# Define a model for the restaurant resource
restaurant_model = api.model('Restaurant', {
    'id': fields.Integer(description='The unique identifier of a restaurant', readonly=True),
    'name': fields.String(required=True, description='The name of the restaurant'),
    'cuisine': fields.String(required=True, description='The type of cuisine served'),
})

# In-memory data store (for demonstration purposes)
restaurants = []

@api.route('/')
class RestaurantList(Resource):
    @api.marshal_list_with(restaurant_model)
    def get(self):
        """List all restaurants"""
        return restaurants

    @api.expect(restaurant_model)
    @api.marshal_with(restaurant_model, code=201)
    def post(self):
        """Create a new restaurant"""
        new_restaurant = api.payload
        new_restaurant['id'] = len(restaurants) + 1
        restaurants.append(new_restaurant)
        return new_restaurant, 201

@api.route('/<int:id>')
@api.response(404, 'Restaurant not found')
class Restaurant(Resource):
    @api.marshal_with(restaurant_model)
    def get(self, id):
        """Fetch a restaurant given its identifier"""
        restaurant = next((r for r in restaurants if r['id'] == id), None)
        if restaurant is None:
            api.abort(404, "Restaurant not found")
        return restaurant

    @api.response(204, 'Restaurant deleted')
    def delete(self, id):
        """Delete a restaurant given its identifier"""
        global restaurants
        restaurants = [r for r in restaurants if r['id'] != id]
        return '', 204
