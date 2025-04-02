-- Create ZONE_VISITOR_HISTORY table
CREATE TABLE ZONE_VISITOR_HISTORY (
    zone_visitor_history_id SERIAL PRIMARY KEY,
    date_time TIMESTAMP DEFAULT NOW(),
    zone_id INT NOT NULL REFERENCES ZONE(zone_id) ON DELETE CASCADE,
    visitor_count INT CHECK (visitor_count >= 0)
);