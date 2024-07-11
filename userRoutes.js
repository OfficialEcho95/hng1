const express = require('express');
const { registerUser, loginUser } = require('./userController');
const { authenticateToken } = require('./authMiddleware');


const router = express();


router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router 