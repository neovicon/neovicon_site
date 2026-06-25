const Resource = require('../models/resourceModel');
const { z } = require('zod');

const resourceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().url("Valid URL is required"),
  type: z.enum(['affiliate', 'tool', 'book']),
  isAffiliate: z.boolean().optional()
});

const sendError = (res, statusCode, message) => res.status(statusCode).json({ success: false, error: message });

exports.getResources = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const resources = await Resource.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resource.countDocuments();

    res.json({
      success: true,
      data: {
        resources,
        pagination: { total, page, pages: Math.ceil(total / limit) }
      }
    });
  } catch (err) {
    sendError(res, 500, 'Server error fetching resources');
  }
};

exports.getAdminResources = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const resources = await Resource.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resource.countDocuments();

    res.json({
      success: true,
      data: {
        resources,
        pagination: { total, page, pages: Math.ceil(total / limit) }
      }
    });
  } catch (err) {
    sendError(res, 500, 'Server error fetching resources');
  }
};

exports.createResource = async (req, res) => {
  try {
    const parsed = resourceSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, parsed.error.errors[0].message);

    const resource = new Resource(parsed.data);
    await resource.save();

    res.status(201).json({ success: true, data: resource });
  } catch (err) {
    sendError(res, 500, 'Server error creating resource');
  }
};

exports.updateResource = async (req, res) => {
  try {
    const parsed = resourceSchema.partial().safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, parsed.error.errors[0].message);

    const resource = await Resource.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
    if (!resource) return sendError(res, 404, 'Resource not found');

    res.json({ success: true, data: resource });
  } catch (err) {
    sendError(res, 500, 'Server error updating resource');
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return sendError(res, 404, 'Resource not found');
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err) {
    sendError(res, 500, 'Server error deleting resource');
  }
};
