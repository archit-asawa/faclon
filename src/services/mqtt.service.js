const { setMessageHandler } = require('../config/mqtt');
const sensorService = require('./sensor.service');
const logger = require('../utils/logger');

const mqttMessageHandler = (topic, payload) => {
  try {
    logger.info('MQTT message received', { topic, payload: payload.toString() });
    
    const message = JSON.parse(payload.toString());

    // Extract deviceId from topic: iot/sensor/{deviceId}/temperature
    const topicParts = topic.split('/');
    if (topicParts.length !== 4) {
      logger.warn('Invalid MQTT topic format', { topic });
      return;
    }

    const deviceId = topicParts[2];

    // Validate temperature
    if (typeof message.temperature !== 'number') {
      logger.warn('Invalid temperature in MQTT message', { deviceId, message });
      return;
    }

    // Create sensor reading
    const readingData = {
      deviceId,
      temperature: message.temperature,
      timestamp: message.timestamp || Date.now(),
    };

    sensorService.createReading(readingData)
      .then(() => {
        logger.info('MQTT message processed successfully', { deviceId, temperature: message.temperature });
      })
      .catch((error) => {
        logger.error('Failed to process MQTT message', { deviceId, error: error.message });
      });
  } catch (error) {
    logger.error('MQTT message processing error', { error: error.message, payload: payload.toString() });
  }
};

const startMQTTSubscription = () => {
  setMessageHandler(mqttMessageHandler);
  logger.info('MQTT message handler registered');
};

const stopMQTTSubscription = () => {
  logger.info('MQTT subscription stopped');
};

module.exports = {
  startMQTTSubscription,
  stopMQTTSubscription,
};

module.exports = {
  startMQTTSubscription,
  stopMQTTSubscription,
};
