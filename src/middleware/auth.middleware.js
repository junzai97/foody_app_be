const jwt = require('jsonwebtoken');
const { getUserWithId } = require('../repository/users.repository')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //Check whether the user id received from the token table matches with the id in the token
        req.user = await getUserWithId(decoded.id);
        next();
    } catch (err) {
        res.status(401).send("User is not authorized")
    }
}

module.exports = auth