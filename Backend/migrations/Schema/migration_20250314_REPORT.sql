-- Create REPORT table
CREATE TABLE REPORT (
    report_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES "USER"(user_id) ON DELETE CASCADE,
    zone_id INT NOT NULL REFERENCES ZONE(zone_id) ON DELETE CASCADE,
    report_status VARCHAR(50) NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    report_message TEXT,
    created_time TIMESTAMP DEFAULT NOW(),
    report_image VARCHAR(255)
);