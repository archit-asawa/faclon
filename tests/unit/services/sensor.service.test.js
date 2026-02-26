const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const sensorService = require('../../../src/services/sensor.service');
const SensorReading = require('../../../src/models/SensorReading.model');
const ApiError = require('../../../src/utils/apiError');

let mongoServer;

describe('Sensor Service Unit Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await SensorReading.deleteMany({});
  });

  describe('createReading', () => {
    it('should create a new sensor reading with default timestamp', async () => {
      const result = await sensorService.createReading({
        deviceId: 'sensor-01',
        temperature: 25.5,
      });

      expect(result.deviceId).toBe('sensor-01');
      expect(result.temperature).toBe(25.5);
      expect(result.timestamp).toBeDefined();
    });

    it('should create reading with provided timestamp', async () => {
      const timestamp = Date.now();
      const result = await sensorService.createReading({
        deviceId: 'sensor-02',
        temperature: 30.0,
        timestamp,
      });

      expect(result.timestamp).toBe(timestamp);
    });
  });

  describe('getLatestReading', () => {
    it('should retrieve the latest reading for a device', async () => {
      await sensorService.createReading({
        deviceId: 'sensor-01',
        temperature: 25.5,
      });

      await sensorService.createReading({
        deviceId: 'sensor-01',
        temperature: 26.0,
      });

      const result = await sensorService.getLatestReading('sensor-01');

      expect(result.deviceId).toBe('sensor-01');
      expect(result.temperature).toBe(26.0);
    });

    it('should throw 404 if no readings found', async () => {
      await expect(
        sensorService.getLatestReading('non-existent')
      ).rejects.toThrow(ApiError);
    });
  });

  describe('getReadingStats', () => {
    it('should return statistics for a device', async () => {
      await sensorService.createReading({
        deviceId: 'sensor-stats',
        temperature: 20.0,
      });

      await sensorService.createReading({
        deviceId: 'sensor-stats',
        temperature: 30.0,
      });

      await sensorService.createReading({
        deviceId: 'sensor-stats',
        temperature: 25.0,
      });

      const stats = await sensorService.getReadingStats('sensor-stats');

      expect(stats.minTemp).toBe(20.0);
      expect(stats.maxTemp).toBe(30.0);
      expect(stats.count).toBe(3);
      expect(stats.avgTemp).toBeCloseTo(25.0);
    });
  });
});
