const express = require('express');
const router = express.Router();
const {connection} = require('../db/mysql');

//CREATE YOUR REST API UNDER HERE
router.post('/users', (req, res) => {
    connection.query('INSERT INTO user SET username = ?, email = ?, gender = ?', [req.body.username, req.body.email, req.body.gender], (error, results, fields) => {
        if(error){
            throw error;
        }

        res.status(201).send("User is registered");
    })
})

router.get('/users', (req,res) => {
    connection.query('SELECT * FROM user WHERE username = ?', [req.body.username], (error, results, fields) => {
        if(error){
            throw error;
        }

        res.status(200).send(results)
    })
})

module.exports = router;