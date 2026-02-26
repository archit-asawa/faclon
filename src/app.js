const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const ApiResponse = require('./utils/apiResponse');
const errorHandler = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');
const routes = require('./routes/index');
const config = require('./config/env');
const logger = require('./utils/logger');

const app = express();

// Security & Logging Middlewares
app.use(helmet());
app.use(cors());
app.use(requestLogger);

// Rate Limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later',
});
app.use(limiter);

// Body Parser Middlewares
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// Health Check Endpoint
app.get('/health', (_req, res) => {
  res.status(200).json(
    new ApiResponse(200, {
      status: 'healthy',
      timestamp: new Date(),
      uptime: process.uptime(),
    }, 'Service is healthy')
  );
});

// API Routes
app.use(`/api/${config.apiVersion}`, routes);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json(
    new ApiResponse(404, null, 'Endpoint not found')
  );
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
