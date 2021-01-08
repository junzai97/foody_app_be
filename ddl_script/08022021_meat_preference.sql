CREATE TABLE IF NOT EXISTS meat_preference (
    id BIGINT AUTO_INCREMENT,
    meat_id BIGINT NOT NULL,
    preference_id BIGINT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TIMESTAMP,

    PRIMARY KEY (id),
    FOREIGN KEY (meat_id) REFERENCES meat(id) 
);
