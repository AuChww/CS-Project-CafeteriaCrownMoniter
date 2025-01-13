import bcrypt

# Assuming the user has a stored password
stored_password = "the_stored_password_in_db"

# Rehash the password with bcrypt
new_hashed_password = bcrypt.hashpw("new_password".encode('utf-8'), bcrypt.gensalt())

def hash_password(password):
    salt = bcrypt.gensalt()  # Generate salt
    print("111")
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)  # Hash password
    print(hashed_password)
    return hashed_password.decode('utf-8')  # Save hashed password as string

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
