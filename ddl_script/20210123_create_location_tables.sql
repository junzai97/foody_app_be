CREATE TABLE IF NOT EXISTS foodie_location (
    id BIGINT AUTO_INCREMENT,
    location_name VARCHAR(255),
    location_address TEXT,
    latitude DOUBLE,
    longitude DOUBLE,
    geohash VARCHAR(20),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TIMESTAMP,
    
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS meat_location (
    id BIGINT AUTO_INCREMENT,
    meat_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TIMESTAMP,
    
    PRIMARY KEY (id),
    FOREIGN KEY (meat_id) REFERENCES meat(id),
    FOREIGN KEY (location_id) REFERENCES foodie_location(id)
);

CREATE TABLE IF NOT EXISTS post_location (
    id BIGINT AUTO_INCREMENT,
    post_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TIMESTAMP,
    
    PRIMARY KEY (id),
    FOREIGN KEY (post_id) REFERENCES post(id),
    FOREIGN KEY (location_id) REFERENCES foodie_location(id)
);

CREATE TABLE IF NOT EXISTS user_location (
    id BIGINT AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TIMESTAMP,
    
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (location_id) REFERENCES foodie_location(id)
);


