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

//Get following with follower_user_id and following_user_id
function getFollowingWithUsersId(followerUserId, followingUserId){
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM following WHERE follower_user_id = ? AND following_user_id = ?`, 
            [followerUserId, followingUserId],
            (error, results, fields) => {
                const result = results[0];
                error? reject(error): resolve(result);
            }
        )
    })
}

//Get all following user
function getAllFollowingUsers(userId){
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT U.*, S.media_link FROM user AS U 
            INNER JOIN following AS F ON U.id = F.following_user_id
            LEFT JOIN storage AS S ON U.image_storage_id = S.id
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
    getFollowingWithUsersId,
    getUserFollowerCount,
    getUserFollowingCount,
    deleteFollowing
}