
-- Create RESTAURANT_VISITOR_HISTORY table
CREATE TABLE RESTAURANT_VISITOR_HISTORY (
    restaurant_visitor_history_id SERIAL PRIMARY KEY,
    date_time TIMESTAMP DEFAULT NOW(),
    restaurant_id INT NOT NULL REFERENCES RESTAURANT(restaurant_id) ON DELETE CASCADE,
    visitor_count INT CHECK (visitor_count >= 0)
);