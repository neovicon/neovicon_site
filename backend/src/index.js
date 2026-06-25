const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());

// Strict CORS for production, more permissive for dev
const isProd = process.env.NODE_ENV === 'production';
app.use(cors({
  origin: isProd ? process.env.ALLOWED_ORIGIN : 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Logging
if (isProd) {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neovicon')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route to verify server
app.get('/api/health', (req, res) => {
  res.json({ success: true, data: 'Server is healthy' });
});

// Setup routes here
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/articles', require('./routes/articleRoutes'));
app.use('/api/tutorials', require('./routes/tutorialRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));


// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: isProd ? 'Internal Server Error' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
