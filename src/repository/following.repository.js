const {connection} = require('../config/mysql');
const {createPlaceholderString} = require('../utils/mysql.utils')

//Create new following row
function createFollowing(following){
    return new Promise((resolve, reject) => {
        connection.query(
            `INSERT INTO following (
                ID,
                FOLLOWER_USER_ID,
                FOLLOWING_USER_ID,
                CREATED_DATE
            ) VALUES (${createPlaceholderString(4)})`,
            [
                following.id,
                following.followerUserId,
                following.followingUserId,
                following.createdDate
            ],
            (error, results, fields) => {
                error? reject(error) : resolve(results);
            }
        )
    })
}

//Delete following row
function deleteFollowing(followerUserId, followingUserId){
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM following WHERE follower_user_id = ? AND following_user_id = ?`,
            [followerUserId, followingUserId],
            (error, results, fields) => {
                error? reject(error) : resolve (results);
            }
        )
    })
}

//Get all following user
function getAllFollowingUsers(userId){
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT U.id, U.username, U.image_storage_id FROM user AS U 
            INNER JOIN following AS F ON 
            U.id = F.following_user_id
            WHERE F.follower_user_id = ?`, 
            [userId],
            (error, results, fields) => {
                error? reject(error): resolve(results);
            }
        )
    })
}

//Get numbers of followers by id
function getUserFollowerCount(userId){
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT COUNT(id) AS followerCount FROM following WHERE following_user_id = ?`,
            [userId],
            (error, results, fields) => {
                const followerCount = results[0]
                error? reject(error) : resolve(followerCount); 
            }
        )
    })
}

//Get numbers of following by id
function getUserFollowingCount(userId){
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT COUNT(id) AS followingCount FROM following WHERE follower_user_id = ?`,
            [userId],
            (error, results, fields) => {
                const followingCount = results[0]
                error? reject(error) : resolve(followingCount); 
            }
        )
    })
}


module.exports = {
    createFollowing,
    getAllFollowingUsers,
    getUserFollowerCount,
    getUserFollowingCount,
    deleteFollowing
}