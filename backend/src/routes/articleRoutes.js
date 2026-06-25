const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// Public Routes
router.get('/', articleController.getArticles);
router.get('/slug/:slug', articleController.getArticleBySlug);

// Protected Admin Routes
router.use('/admin', verifyToken, requireAdmin);
router.get('/admin', articleController.getAdminArticles);
router.post('/admin', articleController.createArticle);
router.put('/admin/:id', articleController.updateArticle);
router.delete('/admin/:id', articleController.deleteArticle);

module.exports = router;
