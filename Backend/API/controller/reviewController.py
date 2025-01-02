from flask_restx import Api, Resource, fields
from flask import Blueprint
from Application.Service.feature.reviewService import ReviewService

api = Api()
review_ns = api.namespace('review', description='Review operations')

review_model = api.model('Review', {
    'review_id': fields.Integer(),
    'user_id': fields.Integer(),
    'restaurant_id': fields.Integer(),
    'rating': fields.Integer(),
    'comment': fields.String(),
    'created_at': fields.DateTime(),
})

@review_ns.route('/getAllReview')
class ReviewList(Resource):
    def get(self):
        return ReviewService.get_all_reviews()
