const request = require('supertest');
const app = require('../../src/app');
const { connectDB, disconnectDB } = require('../../src/config/database');

describe('Sensor API Integration Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe('POST /api/v1/sensor/ingest', () => {
    it('should ingest a valid sensor reading', async () => {
      const response = await request(app)
        .post('/api/v1/sensor/ingest')
        .send({
          deviceId: 'sensor-test-01',
          temperature: 25.5,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.deviceId).toBe('sensor-test-01');
      expect(response.body.data.temperature).toBe(25.5);
    });

    it('should reject invalid temperature', async () => {
      const response = await request(app)
        .post('/api/v1/sensor/ingest')
        .send({
          deviceId: 'sensor-test-02',
          temperature: 200,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject missing deviceId', async () => {
      const response = await request(app)
        .post('/api/v1/sensor/ingest')
        .send({
          temperature: 25.5,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/sensor/:deviceId/latest', () => {
    it('should retrieve latest reading for a device', async () => {
      // First ingest a reading
      await request(app)
        .post('/api/v1/sensor/ingest')
        .send({
          deviceId: 'sensor-latest-test',
          temperature: 22.3,
        });

      // Then retrieve it
      const response = await request(app)
        .get('/api/v1/sensor/sensor-latest-test/latest');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.deviceId).toBe('sensor-latest-test');
    });

    it('should return 404 for non-existent device', async () => {
      const response = await request(app)
        .get('/api/v1/sensor/non-existent-device/latest');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('healthy');
    });
  });
});
