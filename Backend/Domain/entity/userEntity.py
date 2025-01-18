import bcrypt

class UserEntity:
    def __init__(self, user_id, user_image=None, username=None, password=None, role=None, email=None):
        self.user_id = user_id
        self.user_image = user_image
        self.username = username
        self.password = password
        self.email = email
        self.role = role

    def check_password(self, plain_password):
        # ใช้ bcrypt ในการตรวจสอบรหัสผ่าน
        return bcrypt.checkpw(plain_password.encode('utf-8'), self.password.encode('utf-8'))