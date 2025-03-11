-- ติดตั้ง pgcrypto extension เพื่อให้สามารถใช้ crypt() และ gen_salt ได้
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ใช้ bcrypt ใน PostgreSQL
INSERT INTO "USER" (user_image, username, password, role, email) 
VALUES 
('admin1.png', 'admin1', crypt('password123', gen_salt('bf')), 'admin', 'admin1@example.com'),
('b6410450000.png', 'b6410450000', crypt('password123', gen_salt('bf')), 'user', 'b6410450000@example.com');
