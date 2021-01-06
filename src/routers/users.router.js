const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const { toMysqlTimestampString } = require('../utils/mysql.utils');
const { createUser, getUser} = require('../repository/users.repostitory')
const { createStorage } = require('../repository/storage.repostitory');
const User = require('../entities/user.entity');
const { auth } = require('../config/firebase');
const AttachmentType = require('../enums/attachmentType.enum');

router.post('/users', async (req,res) => {
    const userDTO = req.body;
    try {
        const savedStorageResult = await createStorage(
            userDTO.base64String,
            AttachmentType.USER
        );
        const user = new User(
            null,
            savedStorageResult.insertId,
            userDTO.username,
            userDTO.email,
            userDTO.password,
            userDTO.gender,
            userDTO.biography,
            toMysqlTimestampString(new Date()),
            toMysqlTimestampString(new Date()),
        );
        const salt = await bcrypt.genSalt(5);
        user.password = await bcrypt.hash(user.password, salt);
        const savedResult = await createUser(user);
        res
        .status(200)
        .send(`User with ${savedResult.insertId} saved succesfully`);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})


router.post('/users/login', async (req,res) => {
    const userDTO = req.body;
    try{
        const user = await getUser(userDTO.email);

        if(!user){
            return res.status(400).send("Your email or password is incorrect.")
        }
        
        const isMatch = await bcrypt.compare(userDTO.password, user.password);
        
        if(!isMatch){
            return res.status(400).send("Your email or password is incorrect.")
        }

        res.status(200).send(user);

    } catch(err){
        console.log(err);
        res.status(400).send(err);
    }
})

module.exports = router;