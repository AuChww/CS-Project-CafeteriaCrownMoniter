-- Create BAR table
CREATE TABLE BAR (
    bar_id SERIAL PRIMARY KEY,
    bar_name VARCHAR(255) NOT NULL,
    bar_location TEXT NOT NULL,
    bar_detail TEXT,
    current_visitor_count INT DEFAULT 0 CHECK (current_visitor_count >= 0),
    max_people_in_bar INT CHECK (max_people_in_bar >= 0),
    bar_rating INT DEFAULT 0 CHECK (bar_rating >= 0),
    total_rating INT DEFAULT 0 CHECK (total_rating >= 0),
    total_reviews INT DEFAULT 0 CHECK (total_reviews >= 0),
    bar_image VARCHAR(255)
);