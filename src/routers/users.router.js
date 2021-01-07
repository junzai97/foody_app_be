const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const { toMysqlTimestampString } = require('../utils/mysql.utils');
const { createUser, getUserWithEmail, getUserWithUsername, createToken, removeToken} = require('../repository/users.repostitory')
const { createStorage } = require('../repository/storage.repostitory');
const { hasMissingKey } = require("../utils/compare.utils");
const User = require('../entities/user.entity');
const UserDTO = require('../dtos/userDTO.dto');
const AttachmentType = require('../enums/attachmentType.enum');
const auth = require('../middleware/auth.middleware')

/**
 * @description Register new user
 */
router.post('/users', async (req,res) => {
    const userDTO = req.body;
    const invalidUserDTO = hasMissingKey(userDTO, new UserDTO(), ["id", "biography"]);
    if (invalidUserDTO) {
        return res.status(400).send("invalid request body");
    }
    
    //Check whether the email existed
    const existingEmail = await getUserWithEmail(userDTO.email);
    if(existingEmail){
        return res.status(400).send({error: "Email has been registered."});
    }

    //Check whether the username existed
    const existingUsername = await getUserWithUsername(userDTO.username);
    if(existingUsername){
        return res.status(400).send({error: "Username has been taken"});
    }

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
        res.status(500).send(err);
    }
})

/**
 * @description Login user
 */
router.post('/users/login', async (req,res) => {
    const userDTO = req.body;
    try{
        const user = await getUserWithEmail(userDTO.email);

        if(!user){
            return res.status(400).send("Your email or password is incorrect.")
        }
        
        const isMatch = await bcrypt.compare(userDTO.password, user.password);
        
        if(!isMatch){
            return res.status(400).send("Your email or password is incorrect.")
        }
        
        //Create and store token in the database
        const token = jwt.sign({id: user.id.toString()}, process.env.JWT_SECRET, {expiresIn: 86400})
        await createToken(user.id, token);
        res.status(200).send({auth: true, token});

    } catch(err){
        res.status(400).send(err.message);
    }
})

/**
 * @description Get user info
 */
router.get('/users/me', auth, async (req, res) => {
    try {
        res.status(200).send(req.user);
    } catch (err) {
        res.status(500).send(err);
    }
})
/**
 * @description Logout user
 */
router.post('/users/logout', auth, async (req, res) => {
    try{
        await removeToken(req.user.id, req.token);
        res.status(200).send("User has logout.");
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;