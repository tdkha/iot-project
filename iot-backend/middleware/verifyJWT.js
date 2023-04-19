const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader =  req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return res.status(401).send("No access token");
    const token = authHeader;

    return jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN,
        (err, decoded) => {
            if (err) return res.sendStatus(401); //invalid token
            next()
        }
    );
}

module.exports = verifyJWT
