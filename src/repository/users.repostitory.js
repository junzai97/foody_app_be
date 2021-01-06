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

function getUser(email){
    return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE email = ?', [email], (error, results, fields) => {
            user = results[0];
            error? reject(error):resolve(user);
        }) 
    }) 
}

module.exports = {
    getUser,
    createUser
}
