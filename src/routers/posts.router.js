const express = require('express');
const Post = require('../entities/post.entity');
const { createPost, readPosts, updatePost, deletePost } = require('../repository/posts.repository');
const PostDTO = require('../dtos/postDTO.dto');
const { route } = require('./index.router');
const { hasMissingKey } = require('../utils/compare.utils');
const auth = require("../middleware/auth.middleware");
const router = express.Router();

//CREATE YOUR REST API UNDER HERE

// Create A Post
router.post('/post', auth, async (req, res) => {
    const postDTO = req.body;
    if(hasMissingKey(postDTO, new PostDTO())){
        res.status(400).send("Bad request for postDTO");
    }
    try {
        var post = new Post(
            null,
            postDTO.user_id,
            postDTO.description,
            postDTO.services,
            postDTO.cleanliness,
            postDTO.taste,
            postDTO.price,
        );
        const result = await createPost(post);
        res.status(201).send(`Post with id ${result.insertId} had saved successfully`);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

// Read A Post
router.get('/post', auth, async (req, res) => {
    const postDTO = req.body;
    try {
        var post = await readPosts(req.user.id);
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

module.exports = router;