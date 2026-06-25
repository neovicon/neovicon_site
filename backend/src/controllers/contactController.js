const ContactMessage = require('../models/contactModel');
const { z } = require('zod');

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message is too short"),
  honeypot: z.string().optional()
});

const sendError = (res, statusCode, message) => res.status(statusCode).json({ success: false, error: message });

exports.submitContact = async (req, res) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, parsed.error.errors[0].message);

    const { name, email, message, honeypot } = parsed.data;

    // Honeypot check: If the hidden field is filled, it's a bot
    if (honeypot && honeypot.length > 0) {
      return res.status(200).json({ success: true, data: 'Message received' }); // Fake success for bots
    }

    // Minimum time-to-submit check (bot detection via timestamp)
    // Expecting frontend to send a timestamp of when form was rendered
    const formRenderTime = req.body.timestamp;
    if (formRenderTime) {
      const timeDiff = Date.now() - parseInt(formRenderTime, 10);
      if (timeDiff < 3000) { // Less than 3 seconds to fill form
        return res.status(200).json({ success: true, data: 'Message received' }); // Fake success
      }
    }

    const contactMessage = new ContactMessage({
      name,
      email,
      message,
      ipAddress: req.ip
    });

    await contactMessage.save();

    res.status(201).json({ success: true, data: 'Message submitted successfully' });
  } catch (err) {
    sendError(res, 500, 'Server error submitting message');
  }
};

// Admin Route
exports.getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ContactMessage.countDocuments();

    res.json({
      success: true,
      data: {
        messages,
        pagination: { total, page, pages: Math.ceil(total / limit) }
      }
    });
  } catch (err) {
    sendError(res, 500, 'Server error fetching messages');
  }
};
