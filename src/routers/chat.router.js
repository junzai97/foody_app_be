const express = require('express');
const auth = require("../middleware/auth.middleware");
const { handleError } = require('../utils/router.utils');
const { getAllFollowingUsers } = require('../repository/following.repository');
const router = express.Router();

router.get('/chat', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await getAllFollowingUsers(userId);
        res.status(200).send(result);
    } catch (error) {
        handleError(res, error)
    }
})

module.exports = router;