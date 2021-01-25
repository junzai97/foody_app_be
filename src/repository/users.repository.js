const { connection } = require('../config/mysql');
const {createPlaceholderString} = require('../utils/mysql.utils')

function createUser(user){
    return new Promise((resolve, reject)=> {
        connection.query(
            `INSERT INTO USER (
                ID,
                USERNAME,
                EMAIL,
                PASSWORD,
                CREATED_DATE,
                LAST_MODIFIED_DATE
            ) VALUES (${createPlaceholderString(6)})`,
            [
                user.id,
                user.username,
                user.email,
                user.password,
                user.createdDate,
                user.lastModifiedDate
            ],
            (error, results, fields) => {
                error? reject(error) : resolve(results);
            }
        );
    });
}

function getUserWithEmail(email){
    return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE email = ?', [email], (error, results, fields) => {
            user = results[0];
            error? reject(error):resolve(user);
        }) 
    }) 
}

function getUserWithUsername(username){
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE username = ?', [username], (error, results,fields) => {
            const user = results[0];
            error? reject(error):resolve(user);
        })
    })
}

function getUserLikeUsername(username){
    return new Promise((resolve, reject) => {
        connection.query(`
        SELECT U.id, U.username, S.media_link 
        FROM user AS U
        LEFT JOIN storage AS S ON U.image_storage_id = S.id
        WHERE U.username LIKE ?`,
        ["%" + username + "%"], (error, results, fields) => {
            error? reject(error): resolve(results);
        } )
    })
}

function getUserWithId(id){
    return new Promise((resolve, reject) => {
        connection.query(`
        SELECT U.*, S.media_link FROM user AS U 
        LEFT JOIN storage AS S 
        ON U.image_storage_id = S.id
        WHERE U.id = ?`, 
        [id], 
        (error, results, fields) => {
            const user = results[0];
            error? reject(error): resolve(user);
        })
    })
}

function updateUserDetails(userDetails){
    return new Promise((resolve, reject) => {
        connection.query('UPDATE user SET image_storage_id = ?, gender = ?, biography = ? , last_modified_date = ? WHERE id = ?', 
        [
            userDetails.imageStorageId, 
            userDetails.gender, 
            userDetails.biography,
            userDetails.lastModifiedDate, 
            userDetails.id
        ], 
        (error, results, fields) => {
            error? reject(error): resolve();
        })
    })
}

module.exports = {
    createUser,
    getUserWithEmail,
    getUserWithUsername,
    getUserLikeUsername,
    getUserWithId,
    updateUserDetails
}
