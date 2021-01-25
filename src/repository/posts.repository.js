const { createPoolCluster } = require('mysql');
const { connection } = require('../config/mysql');
const { auth,db } = require('../config/firebase');
const Post = require('../entities/post.entity');
const { InvalidEntity } = require('../exceptions/InvalidEntity.exception');
const { createPlaceholderString } = require('../utils/mysql.utils');
const { hasMissingKey } = require('../utils/compare.utils');

function createPost(post){
    if(hasMissingKey(post, new Post(), ["username"])){
        throw new Error("Cannot save invalid Post object to DB");
    }
    return new Promise((resolve, reject)=>{
        console.log(post);
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
                new Date(),
                new Date(),
            ], 
            (error, results, fields) => {
                error? reject(error):resolve(results);
            }
        )
    });
}

function readPosts(user_id){
    return new Promise ((resolve, reject) => {
        connection.query(`
            SELECT followings.username, post.*, storage.media_link
            FROM following
            LEFT JOIN user ON user.id = following.follower_user_id
            LEFT JOIN user as followings ON followings.id = following.following_user_id
            LEFT JOIN post ON post.user_id = following.following_user_id
            LEFT JOIN post_storage ON post_storage.post_id = post.id
            LEFT JOIN storage ON storage.id = post_storage.id
            WHERE user.id = ?
            ORDER BY post.created_date DESC`, [user_id], 
                (error, results, fields) => {
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
            `UPDATE post 
            SET description = ?, services = ?, cleanliness = ?, taste = ?, price = ?, last_modified_date = ? 
            WHERE id = ?;`,
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

function insertPostImage(image){
    return new Promise((resolve, reject)=>{
        connection.query(`INSERT INTO post_storage VALUES(${createPlaceholderString(5)})`,
        [
            image.id,
            image.post_id,
            image.storage_id, 
            new Date(),
            new Date(),
        ],(error, results, fields) => {
            error ? reject(error) : resolve(results);
        });
    });
}

module.exports = {
    createPost,
    readPost,
    readPosts,
    updatePost,
    deletePost,
    insertPostImage
}
