const express = require('express');
const router = express.Router();
const { login, signup, refresh, logout } = require('../controllers/authController');
const { loginRateLimiter } = require('../middleware/authMiddleware');

// Using loginRateLimiter to prevent brute-force attacks
router.post('/login', loginRateLimiter, login);
router.post('/signup', signup);
router.get('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;
