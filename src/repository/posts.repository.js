const { createPoolCluster } = require('mysql');
const { connection } = require('../config/mysql');
const { auth,db } = require('../config/firebase');
const Post = require('../entities/post.entity');
const { InvalidEntity } = require('../exceptions/InvalidEntity.exception');
const { createPlaceholderString } = require('../utils/mysql.utils');

function createPost(post){
    if(!post instanceof Post){
        throw new InvalidEntity("This is not a post object");
    }
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

function readPost(){
    return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM posts WHERE user_id = ?', [username], (error, results, fields) => {
            error? reject(error):resolve(results);
        }) 
    }) 
}

function updatePost(){

}

function deletePost(){

}

module.exports = {
    createPost,
    readPost,
    updatePost,
    deletePost
}
