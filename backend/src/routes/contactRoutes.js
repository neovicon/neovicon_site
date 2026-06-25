const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { contactRateLimiter, verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.post('/', contactRateLimiter, contactController.submitContact);

router.use('/admin', verifyToken, requireAdmin);
router.get('/admin', contactController.getMessages);

module.exports = router;
