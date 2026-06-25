const Tutorial = require('../models/tutorialModel');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const { z } = require('zod');

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const sectionSchema = z.object({
  title: z.string().min(1, "Section title is required"),
  content: z.string().min(1, "Section content is required"),
  order: z.number()
});

const tutorialSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  sections: z.array(sectionSchema).optional(),
  published: z.boolean().optional()
});

const sendError = (res, statusCode, message) => res.status(statusCode).json({ success: false, error: message });

exports.getTutorials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { published: true };
    if (req.query.level) query.level = req.query.level;

    const tutorials = await Tutorial.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Tutorial.countDocuments(query);

    res.json({
      success: true,
      data: {
        tutorials,
        pagination: { total, page, pages: Math.ceil(total / limit) }
      }
    });
  } catch (err) {
    sendError(res, 500, 'Server error fetching tutorials');
  }
};

exports.getAdminTutorials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const tutorials = await Tutorial.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Tutorial.countDocuments();

    res.json({
      success: true,
      data: {
        tutorials,
        pagination: { total, page, pages: Math.ceil(total / limit) }
      }
    });
  } catch (err) {
    sendError(res, 500, 'Server error fetching tutorials');
  }
};

exports.createTutorial = async (req, res) => {
  try {
    const parsed = tutorialSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, parsed.error.errors[0].message);

    const data = parsed.data;
    if (data.sections) {
      data.sections = data.sections.map(sec => ({
        ...sec,
        content: purify.sanitize(sec.content)
      }));
    }

    const tutorial = new Tutorial(data);
    await tutorial.save();

    res.status(201).json({ success: true, data: tutorial });
  } catch (err) {
    if (err.code === 11000) return sendError(res, 400, 'Slug already exists');
    sendError(res, 500, 'Server error creating tutorial');
  }
};

exports.updateTutorial = async (req, res) => {
  try {
    const parsed = tutorialSchema.partial().safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, parsed.error.errors[0].message);

    const data = parsed.data;
    if (data.sections) {
      data.sections = data.sections.map(sec => ({
        ...sec,
        content: purify.sanitize(sec.content)
      }));
    }

    const tutorial = await Tutorial.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!tutorial) return sendError(res, 404, 'Tutorial not found');

    res.json({ success: true, data: tutorial });
  } catch (err) {
    if (err.code === 11000) return sendError(res, 400, 'Slug already exists');
    sendError(res, 500, 'Server error updating tutorial');
  }
};

exports.deleteTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findByIdAndDelete(req.params.id);
    if (!tutorial) return sendError(res, 404, 'Tutorial not found');
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err) {
    sendError(res, 500, 'Server error deleting tutorial');
  }
};
