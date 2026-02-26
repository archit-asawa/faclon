const express = require('express');
const sensorController = require('../controllers/sensor.controller');
const validateSensorReadingMiddleware = require('../middlewares/validator');

const router = express.Router();

// POST /api/sensor/ingest - Create new sensor reading
router.post('/ingest', validateSensorReadingMiddleware, sensorController.ingestReading);

// GET /api/sensor/:deviceId/latest - Get latest reading
router.get('/:deviceId/latest', sensorController.getLatestReading);

// GET /api/sensor/:deviceId/history - Get reading history
router.get('/:deviceId/history', sensorController.getReadingHistory);

// GET /api/sensor/:deviceId/stats - Get statistics
router.get('/:deviceId/stats', sensorController.getReadingStats);

// DELETE /api/sensor/:deviceId - Delete all readings for device
router.delete('/:deviceId', sensorController.deleteDeviceReadings);

module.exports = router;
