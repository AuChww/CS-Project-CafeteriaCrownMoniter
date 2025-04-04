from Infrastructure.Repository.userRepository import (
    get_all_users,
    get_user_by_id,
    get_user_by_username,
    get_reviews_by_user_id,
    get_all_reports_by_user_id,
    update_user_image_path,
    get_user_image,
    add_user,
    update_user,
    delete_user,
)
from Application.Service.utils.security import hash_password

def get_all_users_service():
    return get_all_users()

def get_user_by_id_service(user_id):
    return get_user_by_id(user_id)

def get_user_by_username_service(username):
    return get_user_by_username(username)

def get_reviews_by_user_id_service(user_id):
    return get_reviews_by_user_id(user_id)

def get_all_reports_by_user_id_service(user_id):
    return get_all_reports_by_user_id(user_id)

def get_user_image_service(user_id):
    return get_user_image(user_id)

def add_user_service(username, email, password, role, user_image=None):
    hashed_password = hash_password(password)
    return add_user(username, email, hashed_password, role, user_image)

def update_user_service(user_id, data):
    print(f"Updating user {user_id} with data: {data}")
    updated = update_user(user_id, data)
    return updated

def update_user_image_service (user_id, file_name):
    return update_user_image_path(user_id, file_name)


def delete_user_service(user_id):
    return delete_user(user_id)
