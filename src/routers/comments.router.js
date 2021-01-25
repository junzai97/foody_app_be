const express = require('express');
const Comment = require('../entities/comment.entity');
const { createComment, readComments, updateComment, deleteComment } = require('../repository/Comments.repository');
const CommentDTO = require('../dtos/commentDTO.dto');
const { route } = require('./index.router');
const { hasMissingKey } = require('../utils/compare.utils');
const auth = require("../middleware/auth.middleware");
const { handleError } = require('../utils/router.utils');
const router = express.Router();

router.post('/comment', auth, async(req, res) => {
    const commentDTO = req.body;
    if(hasMissingKey(commentDTO, new CommentDTO())){
        res.status(400).send("Bad request for commentDTO");
    }
    try {
        var comment = new Comment(
            null,
            commentDTO.user_id, 
            commentDTO.post_id,
            commentDTO.comment,
        )
        const result = await createComment(comment);
        res.status(201).send({'response': `Comment with id ${result.insertId} had saved successfully`, 'commentId': result.insertId });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

router.get('/comment/:postId', auth, async (req, res) => {
    try {
        const postId = req.params.postId;
        const result = await readComments(postId);
        res.status(200).send(result);
    } catch (error) {
        handleError(res, error)
    }
})

router.delete('/comment/:commentId', auth, async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const result = await deleteComment(commentId);
        res.status(200).send(result);
    } catch (error) {
        handleError(res, error);
    }
})

module.exports = router;