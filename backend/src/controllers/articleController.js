const Article = require('../models/articleModel');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const { z } = require('zod');

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional()
});

// Utility for formatting error response
const sendError = (res, statusCode, message) => res.status(statusCode).json({ success: false, error: message });

exports.getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { published: true };
    if (req.query.category) query.category = req.query.category;
    if (req.query.search) query.title = { $regex: req.query.search, $options: 'i' };

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content'); // Do not send full content in list

    const total = await Article.countDocuments(query);

    res.json({
      success: true,
      data: {
        articles,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (err) {
    sendError(res, 500, 'Server error fetching articles');
  }
};

exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, published: true });
    if (!article) return sendError(res, 404, 'Article not found');
    res.json({ success: true, data: article });
  } catch (err) {
    sendError(res, 500, 'Server error fetching article');
  }
};

// Admin Routes below

exports.getAdminArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Article.countDocuments();

    res.json({
      success: true,
      data: {
        articles,
        pagination: { total, page, pages: Math.ceil(total / limit) }
      }
    });
  } catch (err) {
    sendError(res, 500, 'Server error fetching articles');
  }
};

exports.createArticle = async (req, res) => {
  try {
    const parsed = articleSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, parsed.error.errors[0].message);

    const data = parsed.data;
    
    // Sanitize content and prevent raw HTML
    data.content = purify.sanitize(data.content);

    const article = new Article(data);
    await article.save();

    res.status(201).json({ success: true, data: article });
  } catch (err) {
    if (err.code === 11000) return sendError(res, 400, 'Slug already exists');
    sendError(res, 500, 'Server error creating article');
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const parsed = articleSchema.partial().safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, parsed.error.errors[0].message);

    const data = parsed.data;
    if (data.content) {
      data.content = purify.sanitize(data.content);
    }

    const article = await Article.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!article) return sendError(res, 404, 'Article not found');

    res.json({ success: true, data: article });
  } catch (err) {
    if (err.code === 11000) return sendError(res, 400, 'Slug already exists');
    sendError(res, 500, 'Server error updating article');
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return sendError(res, 404, 'Article not found');
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err) {
    sendError(res, 500, 'Server error deleting article');
  }
};
