const logger = require('../utils/logger');
const ApiError = require('../utils/apiError');
const config = require('../config/env');

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || null;

  logger.error('Error caught by handler', {
    statusCode,
    message,
    details,
    stack: err.stack,
  });

  const response = {
    success: false,
    message,
    error: {
      code: err.code || 'UNKNOWN_ERROR',
      details,
    },
  };

  if (config.nodeEnv === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
