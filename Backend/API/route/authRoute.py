import jwt
from flask import Blueprint, request, jsonify
from Application.Service.feature.authService import login_service, SECRET_KEY
from Application.Service.feature.userService import get_user_by_username, add_user_service

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    token, role, error = login_service(username, password)
    
    if error:
        return jsonify({"error": error}), 401
    return jsonify({"role": role,"token": token})

def register_service(username, email, password, role, user_image=None):
    existing_user = get_user_by_username(username)
    if existing_user:
        return None, "Username already exists"

    user_id = add_user_service(username, email, password, role, user_image)
    if not user_id:
        return None, "Failed to register user"
    
    return {"user_id": user_id, "username": username, "email": email}, None

def authorize_service(token):
    try:
        # Decode token
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload, None
    except Exception as e:
        return None, str(e)  # ใช้ `Exception` แทนการจับเฉพาะ `ExpiredSignatureError`

@auth_bp.route('/api/protected-resource', methods=['GET'])
def protected_resource():
    token = request.headers.get('Authorization')  # Get the token from the header
    if token:
        token = token.split(" ")[1]  # Remove 'Bearer' from token
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_role = payload['role']  # Extract the role from the payload
            
            if user_role == 'admin':
                return {"message": "Welcome, admin!"}
            else:
                return {"message": "Access denied. You are not an admin."}
        
        except Exception as e:
            return {"error": str(e)}, 401  # แสดงข้อความข้อผิดพลาดจาก `Exception`
    else:
        return {"error": "Token is required."}, 403
