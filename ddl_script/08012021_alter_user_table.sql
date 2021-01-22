ALTER TABLE user DROP COLUMN firebase_uid;
ALTER TABLE user ADD password VARCHAR(60);