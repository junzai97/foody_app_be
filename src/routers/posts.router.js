const express = require('express');
const Post = require('../entities/post.entity');
const PostStorage = require('../entities/post_storage.entity');
const { createPost, readPosts, updatePost, deletePost, insertPostImage, createLike, getLike } = require('../repository/posts.repository');
const { createPostLocation, findOneLocationByPostId } = require('../repository/postLocation.repository');
const PostDTO = require('../dtos/postDTO.dto');
const { route } = require('./index.router');
const { hasMissingKey } = require('../utils/compare.utils');
const auth = require("../middleware/auth.middleware");
const { createStorage } = require("../repository/storage.repostitory");
const LocationDTO = require('../dtos/locationDTO.dto');
const { createLocation } = require('../repository/location.repostitory');
const router = express.Router();

//CREATE YOUR REST API UNDER HERE

// Create A Post
router.post('/post', auth, async (req, res) => {
    const postDTO = req.body;
    if (hasMissingKey(postDTO, new PostDTO())) {
        res.status(400).send("Bad request for postDTO");
    }
    console.log(postDTO);
    try {
        var post = new Post(
            null,
            postDTO.user_id,
            null,
            postDTO.images,
            postDTO.description,
            postDTO.services,
            postDTO.cleanliness,
            postDTO.taste,
            postDTO.price,
        );
        const postResult = await createPost(post);
        const storage = await createStorage(postDTO.images);
        var post_storage = new PostStorage(
            null,
            postResult.insertId,
            storage.insertId,
        )
        const imageResult = await insertPostImage(post_storage);
        const location = await createLocation(postDTO.locationDTO);
        const locationResult = await createPostLocation(postResult.insertId, location.insertId);

        res.status(201).send(`Post with id ${postResult.insertId} had saved successfully`);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

// Read A Post
router.get('/post', auth, async (req, res) => {
    const postDTO = req.body;
    try {
        var dataArr = await readPosts(req.user.id);

        const post = dataArr.map(el => {
            return {
                ...el,
                locationDTO: new LocationDTO(el.latitude, el.longitude, el.location_name, el.location_address)
            }
        });
        res.status(200).send(post);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

// Update A Post
router.put('/post', async (req, res) => {
    const postDTO = req.body;
    try {
        var post = new Post(
            postDTO.id,
            postDTO.user_id,
            postDTO.description,
            postDTO.services,
            postDTO.cleanliness,
            postDTO.taste,
            postDTO.price,
        );
        const result = await updatePost(post);

        res.status(201).send('Post had updated successfully.');

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

// Delete A Post
router.delete('/post', async (req, res) => {
    const postDTO = req.body;
    try {
        await deletePost(postDTO);
        var result = `{
            "status" : 200,
            "respond" : "success",
            "mssg" : "Post had deleted successfully"
        }`;
        res.status(200).send(JSON.parse(result));

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

// Get a like from a post
router.get('/like/:postId/:userId', auth, async (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId;
    try {
        const result = await getLike(postId, userId);
        if (result.length == 0) {
            res.status(200).send("fail");
        } else {
            res.status(200).send("success");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

// React like to a post
router.post('/like', auth, async (req, res) => {
    const likeDTO = req.body;
    try {
        const result = await createLike(likeDTO);
        res.status(201).send("Post had liked successfully.")
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

module.exports = router;