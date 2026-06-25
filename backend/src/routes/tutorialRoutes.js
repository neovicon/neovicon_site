const express = require('express');
const router = express.Router();
const tutorialController = require('../controllers/tutorialController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', tutorialController.getTutorials);

router.use('/admin', verifyToken, requireAdmin);
router.get('/admin', tutorialController.getAdminTutorials);
router.post('/admin', tutorialController.createTutorial);
router.put('/admin/:id', tutorialController.updateTutorial);
router.delete('/admin/:id', tutorialController.deleteTutorial);

module.exports = router;
