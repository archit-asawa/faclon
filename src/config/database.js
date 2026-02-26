const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('./env');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(config.mongodb.uri, {
      maxPoolSize: config.mongodb.maxPoolSize,
      connectTimeoutMS: config.mongodb.connectTimeout,
      serverSelectionTimeoutMS: config.mongodb.connectTimeout,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    logger.info('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    logger.error('MongoDB connection failed', error);
    throw error;
  }
};

const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    logger.info('MongoDB disconnected');
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  isConnected: () => isConnected,
};
