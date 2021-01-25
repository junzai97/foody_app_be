const { createPoolCluster } = require('mysql');
const { connection } = require('../config/mysql');
const { auth,db } = require('../config/firebase');
const Comment = require('../entities/comment.entity');
const { InvalidEntity } = require('../exceptions/InvalidEntity.exception');
const { createPlaceholderString } = require('../utils/mysql.utils');
const { hasMissingKey } = require('../utils/compare.utils');

function createComment(comment){
    if (hasMissingKey(comment, new Comment())) {
        throw new Error("Cannot save invalid Comment object to DB");
    }
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO post_comment VALUES (${createPlaceholderString(6)})`,
        [
            comment.id,
            comment.post_id,
            comment.user_id,
            comment.comment,
            new Date(),
            new Date()
        ],
        (error, results, fields)=>{
            error ? reject(error) : resolve(results);
        })
    })
}

function readComments(post_id) {
    return new Promise((resolve, reject) => {
        connection.query(`
            SELECT user.username, post_comment.* FROM post_comment
            LEFT JOIN user ON user.id = post_comment.user_id 
            WHERE post_id = ?
            ORDER BY created_date
        `, [post_id], 
        (error, results, fields) => {
            error? reject(error):resolve(results);
        });
    })
}

function updateComment(comment) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE post_comment SET comment = ? WHERE (id = ?)`, 
        [comment.comment, comment.id],(error, results, fields) => {
            error ? reject(error) : resolve(results);
        }); 
    });
}

function deleteComment(commentID) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM post_comment WHERE (id = ?)`, 
        [commentID],(error, results, fields) => {
            error ? reject(error) : resolve(results);
        }); 
    });
}

module.exports = {
    createComment,
    readComments,
    updateComment,
    deleteComment
}