const express = require('express');
const Post = require('../entities/post.entity');
const { createPost } = require('../repository/posts.repository');
const PostDTO = require('../dtos/postDTO.dto');
const router = express.Router();

//CREATE YOUR REST API UNDER HERE
router.post('/post', async (req, res) => {
    const postDTO = req.body;
    if(!postDTO instanceof PostDTO){
        res.status(400).send("invalid request body");
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
        res.status(200).send(`Post with id ${result.insertId} had saved successfully`);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

module.exports = router;