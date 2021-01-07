const { connection } = require('../config/mysql');
const {createPlaceholderString} = require('../utils/mysql.utils')

function createUser(user){
    return new Promise((resolve, reject)=> {
        connection.query(
            `INSERT INTO USER (
                ID,
                FIREBASE_UID,
                USERNAME,
                EMAIL,
                PASSWORD,
                GENDER,
                BIOGRAPHY,
                CREATED_DATE,
                LAST_MODIFIED_DATE
            ) VALUES (${createPlaceholderString(9)})`,
            [
                user.id,
                user.imageStorageId,
                user.username,
                user.email,
                user.password,
                user.gender,
                user.biography,
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
            user = results[0];
            error? reject(error):resolve(user);
        })
    })
}

function getUserWithId(id){
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE id = ?', [id], (error, results, fields) => {
            user = results[0];
            error? reject(error): resolve(user);
        })
    })
}

function createToken( userId, token){
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO token (
            USER_ID,
            TOKEN
        ) VALUES (${createPlaceholderString(2)})`,
        [userId, token], (error, results, fields) => {
            error? reject(error): resolve();
        })
    })
}

function getToken( userId, token ){
    return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM token WHERE user_id = ? AND token = ?', [userId, token], (error, results, fields) => {
            const result = results[0];
            error? reject(error): resolve(result);
        })
    })
}

function removeToken( userId , token) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM token WHERE user_id = ? AND token = ?', [userId, token], (error, results, fields) => {
            error? reject(error): resolve();
        })
    })
}

module.exports = {
    createUser,
    getUserWithEmail,
    getUserWithUsername,
    getUserWithId,
    getToken,
    createToken,
    removeToken
}
