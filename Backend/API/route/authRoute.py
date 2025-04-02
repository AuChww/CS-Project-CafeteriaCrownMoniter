import hmac
import hashlib
import base64
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from Application.Service.feature.authService import login_service, SECRET_KEY
from Application.Service.feature.userService import get_user_by_username, add_user_service

auth_bp = Blueprint('auth', __name__)

def generate_token(user_id, username, role):
    """Function to generate JWT-like token manually using HMAC"""
    payload = {
        "user_id": user_id,
        "username": username,
        "role": role,
        "exp": (datetime.utcnow() + timedelta(hours=1)).isoformat()  # Expiration time (1 hour)
    }

    # Create the header
    header = {"alg": "HS256", "typ": "JWT"}

    # Convert header and payload to JSON strings
    header_b64 = base64.urlsafe_b64encode(str(header).encode()).decode().rstrip("=")
    payload_b64 = base64.urlsafe_b64encode(str(payload).encode()).decode().rstrip("=")

    # Create the signature using HMAC with SECRET_KEY
    message = f"{header_b64}.{payload_b64}"
    signature = hmac.new(SECRET_KEY.encode(), message.encode(), hashlib.sha256).hexdigest()

    # Combine header, payload, and signature
    token = f"{header_b64}.{payload_b64}.{signature}"
    
    return token

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = get_user_by_username(username)
    if not user:
        return jsonify({"error": "Invalid username or password"}), 401

    if user.check_password(password):  # ตรวจสอบรหัสผ่านโดยใช้ bcrypt
        token = generate_token(user.user_id, user.username, user.role)
        return jsonify({"role": user.role, "token": token})

    return jsonify({"error": "Invalid credentials"}), 401

def authorize_service(token):
    try:
        # Decode the token
        parts = token.split(".")
        if len(parts) != 3:
            return None, "Invalid token structure"
        
        header_b64, payload_b64, signature = parts

        # Recreate the message and validate the signature
        message = f"{header_b64}.{payload_b64}"
        expected_signature = hmac.new(SECRET_KEY.encode(), message.encode(), hashlib.sha256).hexdigest()

        if not hmac.compare_digest(expected_signature, signature):
            return None, "Invalid token signature"

        # Decode the payload
        payload = base64.urlsafe_b64decode(payload_b64 + "==").decode()
        return payload, None

    except Exception as e:
        return None, str(e)

@auth_bp.route('/api/protected-resource', methods=['GET'])
def protected_resource():
    token = request.headers.get('Authorization')  # Get the token from the header
    if token:
        token = token.split(" ")[1]  # Remove 'Bearer' from token
        
        payload, error = authorize_service(token)
        if error:
            return jsonify({"error": error}), 401
        
        user_role = payload['role']  # Extract the role from the payload
        
        if user_role == 'admin':
            return jsonify({"message": "Welcome, admin!"})
        else:
            return jsonify({"message": "Access denied. You are not an admin."}), 403
        
    else:
        return jsonify({"error": "Token is required."}), 403
