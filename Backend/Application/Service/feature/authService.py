import base64
import hmac
from hashlib import sha256
import bcrypt
from datetime import datetime, timedelta
from Infrastructure.Repository.userRepository import get_user_by_username

SECRET_KEY = "your_secret_key"

def login_service(username, password):
    # Assuming get_user_by_username and password validation are done correctly
    user = get_user_by_username(username)
    print(user)
    if not user:
        return None, "Invalid username or password"

    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return None, "Invalid username or password"

    payload = {
        "user_id": user.user_id,
        "username": user.username,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }

    header = {"alg": "HS256", "typ": "JWT"}
    encoded_header = base64.urlsafe_b64encode(str(header).encode()).decode().strip("=")
    encoded_payload = base64.urlsafe_b64encode(str(payload).encode()).decode().strip("=")
    signature = hmac.new(SECRET_KEY.encode(), f'{encoded_header}.{encoded_payload}'.encode(), sha256).hexdigest()

    token = f"{encoded_header}.{encoded_payload}.{signature}"
    
    return token,user.role, None
