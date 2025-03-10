-- Create ZONE table
CREATE TABLE ZONE (
    zone_id SERIAL PRIMARY KEY,
    bar_id INT NOT NULL REFERENCES BAR(bar_id) ON DELETE CASCADE,
    zone_name VARCHAR(255) NOT NULL,
    zone_detail TEXT,
    max_people_in_zone INT CHECK (max_people_in_zone >= 0),
    current_visitor_count INT DEFAULT 0 CHECK (current_visitor_count >= 0),
    update_date_time TIMESTAMP DEFAULT NOW(),
    zone_time VARCHAR(20) NOT NULL,
    zone_image VARCHAR(255)
);