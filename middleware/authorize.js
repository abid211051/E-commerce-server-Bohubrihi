const jwt = require('jsonwebtoken');
module.exports = async (req, res, next) => {
    let token = req.header('Authorization');
    if (!token) return res.status(401).send('Unauthorized User');

    token = token.split(" ")[1].trim();
    try {
        const decode = await jwt.verify(token, process.env.JWT_KEY);
        req.user = decode;
        // req.extra = extra;
        next();
    } catch (error) {
        return res.status(500).send(error.message);
    }
}