const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', resourceController.getResources);

router.use('/admin', verifyToken, requireAdmin);
router.get('/admin', resourceController.getAdminResources);
router.post('/admin', resourceController.createResource);
router.put('/admin/:id', resourceController.updateResource);
router.delete('/admin/:id', resourceController.deleteResource);

module.exports = router;
