from Infrastructure.Repository.userRepository import (
    get_all_users,
    get_user_by_id,
    get_reviews_by_user_id,
    add_user,
    update_user,
    delete_user,
)

def get_all_users_service():
    return get_all_users()

def get_user_by_id_service(user_id):
    return get_user_by_id(user_id)

def get_reviews_by_user_id_service(user_id):
    return get_reviews_by_user_id(user_id)

def add_user_service(username, email, password, role, user_image=None):
    return add_user(username, email, password, role, user_image)

def update_user_service(user_id, data):
    return update_user(user_id, data)

def delete_user_service(user_id):
    return delete_user(user_id)
