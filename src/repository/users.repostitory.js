const { createPoolCluster } = require('mysql');
const { connection } = require('../config/mysql');
const { auth,db } = require('../config/firebase');

function getUser(username){
    return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE username = ?', [username], (error, results, fields) => {
            error? reject(error):resolve(results);
        }) 
    }) 
}

module.exports = {
    getUser
}
