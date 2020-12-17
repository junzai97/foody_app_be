const express = require('express');
const router = express.Router();
const {getUser} = require('../repository/users.repostitory')


//CREATE YOUR REST API UNDER HERE
router.get('/users', async (req,res) => {
    try{
        let results = await getUser(req.body.username);
        res.status(200).send(results);
    }catch (err){
        console.log(err)
        res.status(400).send(err);
    }   
})

module.exports = router;