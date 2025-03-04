from flask_restx import Api, Resource, fields
from flask import Blueprint
from Application.Service.feature.userService import UserService

api = Api()
user_ns = api.namespace('user', description='User operations')

user_model = api.model('User', {
    'user_id': fields.Integer(),
    'username': fields.String(),
    'email': fields.String(),
    'role': fields.String(),
})

@user_ns.route('/getAllUser')
class UserList(Resource):
    def get(self):
        return UserService.get_all_users()

@user_ns.route('/getAllReviewByUserId')
class UserReviewList(Resource):
    def get(self, user_id):
        return UserService.get_all_reviews_by_user_id(user_id)
