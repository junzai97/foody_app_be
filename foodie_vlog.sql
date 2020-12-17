CREATE TABLE IF NOT EXISTS storage (
    id BIGINT AUTO_INCREMENT,
    file_name VARCHAR(255),
    bucket VARCHAR(255),
    media_link VARCHAR(255),
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastModifiedDate TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT,
    image_storage_id BIGINT,
    firebase_uid VARCHAR(50),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL,
    gender VARCHAR(50),
    biography TEXT,
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastModifiedDate TIMESTAMP,
    
    PRIMARY KEY (id),
    FOREIGN KEY (image_storage_id) REFERENCES storage(id)
);


CREATE TABLE IF NOT EXISTS post (
    id BIGINT AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    description VARCHAR(255),
    services INT(11),
    cleanliness INT(11),
    taste INT(11),
    price INT(11),
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastModifiedDate TIMESTAMP,

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS post_comment (
    id BIGINT NOT NULL AUTO_INCREMENT,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    comment VARCHAR(255) NOT NULL,
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastModifiedDate TIMESTAMP,

    PRIMARY KEY (id),
    FOREIGN KEY (post_id) REFERENCES post(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS post_reaction (
    id BIGINT NOT NULL AUTO_INCREMENT,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    post_reaction VARCHAR(255) NOT NULL,
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastModifiedDate TIMESTAMP,

    PRIMARY KEY (id),
    FOREIGN KEY (post_id) REFERENCES post(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS post_storage (
    id BIGINT AUTO_INCREMENT,
    post_id BIGINT NOT NULL,
    storage_id BIGINT NOT NULL,
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastModifiedDate TIMESTAMP,

    PRIMARY KEY (id),
    FOREIGN KEY (post_id) REFERENCES post(id),
    FOREIGN KEY (storage_id) REFERENCES storage(id)
);

CREATE TABLE IF NOT EXISTS preference (
    id BIGINT AUTO_INCREMENT,
    name VARCHAR(255),
    description VARCHAR(255),
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastModifiedDate TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user_preference (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    preference_id BIGINT NOT NULL,
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastModifiedDate TIMESTAMP,

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id) 
);

CREATE TABLE IF NOT EXISTS following (
    id BIGINT NOT NULL AUTO_INCREMENT,
    follower_user_id BIGINT NOT NULL,
    following_user_id BIGINT NOT NULL,
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    FOREIGN KEY (follower_user_id) REFERENCES user(id),  
    FOREIGN KEY (following_user_id) REFERENCES user(id) 
);

CREATE TABLE IF NOT EXISTS meat(
    id BIGINT NOT NULL AUTO_INCREMENT,
    image_storage_id BIGINT NOT NULL,
    title VARCHAR(50) NOT NULL,
    description LONGTEXT,
    startTime TIMESTAMP NOT NULL,
    endTime TIMESTAMP NOT NULL,
    status VARCHAR(255),
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastModifiedDate TIMESTAMP,

    PRIMARY KEY(id),
    FOREIGN KEY(image_storage_id) REFERENCES storage(id)
);

CREATE TABLE IF NOT EXISTS meat_user (
    id BIGINT NOT NULL AUTO_INCREMENT,
    meat_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(255),
    status VARCHAR(255),
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastModifiedDate TIMESTAMP,

    PRIMARY KEY(id),
    FOREIGN KEY(meat_id) REFERENCES meat(id),
    FOREIGN KEY(user_id) REFERENCES user(id)
);