const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const { toMysqlTimestampString } = require('../utils/mysql.utils');
const { createUser, getUserWithEmail, getUserWithUsername, updateUserDetails} = require('../repository/users.repostitory')
const { createStorage } = require('../repository/storage.repostitory');
const { hasMissingKey } = require("../utils/compare.utils");
const User = require('../entities/user.entity');
const UserDTO = require('../dtos/userDTO.dto');
const RegisterDTO = require('../dtos/registerDTO.dto');
const LoginDTO = require('../dtos/loginDTO.dto');
const UserDetailsDTO = require('../dtos/userDetailsDTO.dto');
const AttachmentType = require('../enums/attachmentType.enum');
const auth = require('../middleware/auth.middleware')

/**
 * @description Register new user
 */
router.post('/users', async (req,res) => {
    const registerDTO = req.body;
    const invalidRegisterDTO = hasMissingKey(registerDTO, new RegisterDTO());
    if (invalidRegisterDTO) {
        return res.status(400).send("Invalid request body");
    }
    
    try {

        //Check whether the email existed
        const existingEmail = await getUserWithEmail(registerDTO.email);
        if(existingEmail){
            return res.status(400).send({error: "Email has been registered."});
        }

        //Check whether the username existed
        const existingUsername = await getUserWithUsername(registerDTO.username);
        if(existingUsername){
            return res.status(400).send({error: "Username has been taken"});
        }

        const user = new User(
            null,
            null,
            registerDTO.username,
            registerDTO.email,
            registerDTO.password,
            null,
            null,
            toMysqlTimestampString(new Date()),
            toMysqlTimestampString(new Date())
        );
    
        const salt = await bcrypt.genSalt(5);
        user.password = await bcrypt.hash(user.password, salt);
        const result = await createUser(user);

        const token = jwt.sign({id: result.insertId.toString()}, process.env.JWT_SECRET, {expiresIn: 86400})
        res.status(201).send({auth: true, token});

    } catch (err) {
        res.status(500).send(err);
    }
    
    
})

/**
 * @description Update User Details
 */
router.patch('/users/me',auth, async (req, res) => {
    const userDetailsDTO = req.body;
    const invalidUserDetailsDTO = hasMissingKey(userDetailsDTO, new UserDetailsDTO());
    if(invalidUserDetailsDTO){
        res.status(400).send("Invalid request body")
    }
    try {
        const savedStorageResult = await createStorage(
            userDetailsDTO.base64String,
            AttachmentType.USER
        );
        
        const user = {
            id: req.user.id,
            imageStorageId : savedStorageResult.id,
            gender : userDetailsDTO.gender,
            biography: userDetailsDTO.biography,
            lastModifiedDate: toMysqlTimestampString(new Date()),
        }

        await updateUserDetails(user);
        
        res
        .status(200)
        .send(`User updated succesfully`);
    } catch (err) {
        res.status(500).send(err);
    }
})

/**
 * @description Login user
 */
router.post('/users/login', async (req,res) => {
    const loginDTO = req.body;
    const invalidLoginDTO = hasMissingKey(loginDTO, new LoginDTO);
    if(invalidLoginDTO) {
        res.status(400).send('Invalid request body')
    }
    try{
        const user = await getUserWithEmail(loginDTO.email);

        if(!user){
            return res.status(400).send("Your email or password is incorrect.")
        }
        
        const isMatch = await bcrypt.compare(loginDTO.password, user.password);
        
        if(!isMatch){
            return res.status(400).send("Your email or password is incorrect.")
        }
        
        //Create and store token in the database
        const token = jwt.sign({id: user.id.toString()}, process.env.JWT_SECRET, {expiresIn: 86400})
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

module.exports = router;