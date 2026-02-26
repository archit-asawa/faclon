require('dotenv').config();

const requiredEnvs = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
];

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    throw new Error(`Environment variable ${env} is required but not defined`);
  }
}

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  apiVersion: process.env.API_VERSION || 'v1',
  mongodb: {
    uri: process.env.MONGODB_URI,
    maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE, 10) || 10,
    connectTimeout: parseInt(process.env.MONGODB_CONNECT_TIMEOUT, 10) || 30000,
  },
  mqtt: {
    brokerUrl: process.env.MQTT_BROKER_URL,
    clientId: process.env.MQTT_CLIENT_ID,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    topicPattern: process.env.MQTT_TOPIC_PATTERN,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || './logs',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },
};
