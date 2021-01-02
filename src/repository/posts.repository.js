const { createPoolCluster } = require('mysql');
const { connection } = require('../config/mysql');
const { auth,db } = require('../config/firebase');
const Post = require('../entities/post.entity');
const { InvalidEntity } = require('../exceptions/InvalidEntity.exception');
const { createPlaceholderString } = require('../utils/mysql.utils');

function createPost(post){
    return new Promise((resolve, reject)=>{
        connection.query(
            `INSERT INTO post VALUES (${createPlaceholderString(9)})`,
            [
                post.id,
                post.user_id,
                post.description,
                post.services,
                post.cleanliness,
                post.taste,
                post.price,
                post.createdDate,
                post.lastModifiedDate,
            ], 
            (error, results, fields) => {
                error? reject(error):resolve(results);
            }
        )
    });
}

function readPosts(user_id){
    return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM post WHERE user_id = ?', [user_id], (error, results, fields) => {
            error? reject(error):resolve(results);
        }) 
    }) 
}


function readPost(post, user_id){
    return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM post WHERE user_id = ? WHERE id = ?', [user_id, post.id], (error, results, fields) => {
            error? reject(error):resolve(results);
        }) 
    }) 
}

function updatePost(post){
    var now = new Date().toISOString().slice(0, 19).replace('T', ' ');
   
    return new Promise((resolve, reject) => {
        connection.query(
            `UPDATE post ` +
            `SET description = ?, services = ?, cleanliness = ?, taste = ?, price = ?, last_modified_date = ? ` + 
            `WHERE id = ?;`,
        [post.description, post.services, post.cleanliness, post.taste, post.price, now, post.id],
        (error, results, fields) => { 
            error ? reject(error) : resolve(results);
        })
    })
}

function deletePost(post){
    return new Promise((resolve, reject)=>{
        connection.query(`DELETE FROM post WHERE id=?;` , 
        [post.id],
        (error, results, fields) => {
            error ? reject(error) : resolve(results);
        })
    })
}

module.exports = {
    createPost,
    readPost,
    readPosts,
    updatePost,
    deletePost
}
