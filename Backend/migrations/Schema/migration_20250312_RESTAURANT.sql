-- Create RESTAURANT table
CREATE TABLE RESTAURANT (
    restaurant_id SERIAL PRIMARY KEY,
    zone_id INT NOT NULL REFERENCES ZONE(zone_id) ON DELETE CASCADE,
    restaurant_name VARCHAR(255) NOT NULL,
    restaurant_location TEXT NOT NULL,
    restaurant_detail TEXT,
    total_rating INT DEFAULT 0 CHECK (total_rating >= 0),
    total_reviews INT DEFAULT 0 CHECK (total_reviews >= 0),
    restaurant_image VARCHAR(255),
    current_visitor_count INT DEFAULT 0 CHECK (current_visitor_count >= 0)
);
