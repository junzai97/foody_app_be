CREATE TABLE IF NOT EXISTS token (
    id BIGINT AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token TEXT,

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);