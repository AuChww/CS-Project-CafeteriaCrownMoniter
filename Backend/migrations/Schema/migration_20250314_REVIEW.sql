-- Create REVIEW table
CREATE TABLE REVIEW (
    review_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES "USER"(user_id) ON DELETE CASCADE,
    restaurant_id INT NOT NULL REFERENCES RESTAURANT(restaurant_id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_comment TEXT,
    created_time TIMESTAMP DEFAULT NOW(),
    update_time TIMESTAMP DEFAULT NOW(),
    review_image VARCHAR(255)
);