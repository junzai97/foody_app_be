const jwt = require('jsonwebtoken');
const { getUserWithId, getToken } = require('../repository/users.repostitory')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const result = await getToken(decoded.id, token);
        //Check whether the user id received from the token table matches with the id in the token
        if(result.user_id == decoded.id){
            req.token = token;
            req.user = await getUserWithId(result.user_id);
        }
        next();
    } catch (err) {
        res.status(401).send(err)
    }
}

module.exports = auth