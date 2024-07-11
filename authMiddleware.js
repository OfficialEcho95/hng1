const jwt = require('jsonwebtoken');
const User = require('./user');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.AUTH_KEY, { expiresIn: "5H" });
};


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = req.session.token || (authHeader && authHeader.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - missing token' });
    }

    try {
        const user = jwt.verify(token, process.env.AUTH_KEY);

        if (req.session.userId !== user.userId) {
            return res.status(401).json({ error: 'Unauthorized - invalid user' });
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Unauthorized - token expired' });
        } else {
            return res.status(401).json({ error: 'Unauthorized - invalid token' });
        }
    }
};


module.exports = { generateToken, authenticateToken }