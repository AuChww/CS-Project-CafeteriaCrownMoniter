-- Create USER table
CREATE TABLE "USER" (
    user_id SERIAL PRIMARY KEY,
    user_image VARCHAR(255),
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin','user')) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);