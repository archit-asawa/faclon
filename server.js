const app = require('./src/app');
const { connectDB, disconnectDB } = require('./src/config/database');
const { connectMQTT, disconnectMQTT } = require('./src/config/mqtt');
const { startMQTTSubscription, stopMQTTSubscription } = require('./src/services/mqtt.service');
const logger = require('./src/utils/logger');
const config = require('./src/config/env');

let server;
let mqttClient;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Connect to MQTT (optional)
    mqttClient = connectMQTT();
    if (mqttClient) {
      startMQTTSubscription();
    }

    // Start Express Server
    server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  logger.info('Graceful shutdown initiated');

  if (server) {
    server.close(async () => {
      logger.info('Express server closed');

      if (mqttClient) {
        stopMQTTSubscription();
        disconnectMQTT();
      }

      await disconnectDB();
      logger.info('Application shutdown complete');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

process.on('unhandledRejection', (reason, _promise) => {
  logger.error('Unhandled Rejection', { reason });
  process.exit(1);
});

startServer();
