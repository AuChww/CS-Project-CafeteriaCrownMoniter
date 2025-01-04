class UserEntity:
    def __init__(self, user_id, user_image=None, username=None, password=None, role=None, email=None):
        self.user_id = user_id
        self.user_image = user_image
        self.username = username
        self.password = password
        self.role = role
        self.email = email
