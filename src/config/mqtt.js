const mqtt = require('mqtt');
const logger = require('../utils/logger');
const config = require('./env');

let client = null;
let isConnected = false;
let messageHandler = null;

const connectMQTT = () => {
  if (!config.mqtt.brokerUrl) {
    logger.info('MQTT_BROKER_URL not configured, skipping MQTT connection');
    return null;
  }

  try {
    client = mqtt.connect(config.mqtt.brokerUrl, {
      clientId: config.mqtt.clientId,
      username: config.mqtt.username,
      password: config.mqtt.password,
      reconnectPeriod: 1000,
      connectTimeout: 30000,
    });

    client.on('connect', () => {
      isConnected = true;
      logger.info('MQTT connected successfully');
      client.subscribe(config.mqtt.topicPattern, { qos: 1 }, (err) => {
        if (err) {
          logger.error('MQTT subscription failed', err);
        } else {
          logger.info(`MQTT subscribed to ${config.mqtt.topicPattern}`);
        }
      });
    });

    client.on('error', (error) => {
      logger.error('MQTT error', error);
    });

    client.on('disconnect', () => {
      isConnected = false;
      logger.warn('MQTT disconnected');
    });

    client.on('reconnect', () => {
      logger.info('MQTT reconnecting...');
    });

    return client;
  } catch (error) {
    logger.error('MQTT connection failed', error);
    return null;
  }
};

const disconnectMQTT = () => {
  if (client) {
    client.end();
    isConnected = false;
    logger.info('MQTT disconnected');
  }
};

const setMessageHandler = (handler) => {
  messageHandler = handler;
  if (client) {
    client.on('message', handler);
  }
};

module.exports = {
  connectMQTT,
  disconnectMQTT,
  setMessageHandler,
  getClient: () => client,
  isConnected: () => isConnected,
};
