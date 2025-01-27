const express = require('express');
const { register, login, session, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/session', session);
router.post('/logout', logout);

module.exports = router;