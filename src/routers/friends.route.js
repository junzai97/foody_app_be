const express = require('express');
const router = express.Router();

const { toMysqlTimestampString } = require('../utils/mysql.utils');
const { createUser, getUserWithEmail, getUserWithUsername, updateUserDetails, getUserLikeUsername, getUserWithId} = require('../repository/users.repository');
const { createFollowing, getAllFollowingUsers, getFollowingWithUsersId, getUserFollowerCount, getUserFollowingCount, deleteFollowing} = require('../repository/following.repository');
const { hasMissingKey } = require("../utils/compare.utils");
const Following = require('../entities/following.entity');
const auth = require('../middleware/auth.middleware')

/**
 * @description Follow an user
 */
router.post('/friends/:userId', auth, async (req, res) => {  
    try{
        const followerUserId = req.user.id;
        const followingUserId = parseInt(req.params.userId);
        const following = new Following(
            null,
            followerUserId,
            followingUserId,
            toMysqlTimestampString(new Date())
        )
        const savedResult = await createFollowing(following);
        res.status(201).send(`Following with id ${savedResult.insertId} saved succesfully`);
    }catch(err){
        res.status(500).send(err);
    }
})

/**
 * @description Unfollow an user
 */
router.delete('/friends/:userId', auth, async (req, res) => {  
    try{
        const followerUserId = req.user.id;
        const followingUserId = req.params.userId;

        const removedResult = await deleteFollowing(followerUserId, followingUserId );
        res.status(201).send(removedResult);
    }catch(err){
        res.status(500).send(err);
    }
})

/**
 * @description Get all following users
 */
router.get('/friends', auth, async (req, res) => {
    try{
        const followerUserId = req.user.id;
        const results = await getAllFollowingUsers(followerUserId);
        res.status(200).send(results);
    }catch(err){
        res.status(400).send(err);
    }
})


/**
 * @description Search users with username
 */
router.get('/friends/search', auth, async (req,res) => {
    try{
        const username = req.query.username;
        const user = await getUserLikeUsername(username);
        res.status(200).send(user);
    }catch(err){
        res.status(400).send(err);
    }
})


/**
 * @description Get a user details
 */
router.get('/friends/:userId', auth, async (req, res) => {
    try{
        const ownId = req.user.id;
        const userId = req.params.userId;
        const user = await getUserWithId(userId);
        if(user === undefined){
            res.status(404).send('User not found');
        }
        const userFollowingCount = await getUserFollowingCount(userId);
        const userFollowerCount = await getUserFollowerCount(userId);
        const following = await getFollowingWithUsersId(ownId, userId)  
        const isFollowing = (following !== undefined)? true: false;

        res.status(200).send({
            username: user.username,
            imageStorageId: user.image_storage_id,
            gender: user.gender,
            biography: user.biography,
            followingCount: userFollowingCount.followingCount,
            followerCount: userFollowerCount.followerCount,
            isFollowing
        })
    }catch(err){
        res.status(400).send(err);
    }
})



module.exports = router;