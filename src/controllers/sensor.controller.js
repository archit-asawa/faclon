const sensorService = require('../services/sensor.service');
const AsyncHandler = require('../middlewares/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

exports.ingestReading = AsyncHandler(async (req, res) => {
  const reading = await sensorService.createReading(req.body);
  res.status(201).json(
    new ApiResponse(201, reading, 'Sensor reading ingested successfully')
  );
});

exports.getLatestReading = AsyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const reading = await sensorService.getLatestReading(deviceId);
  res.status(200).json(
    new ApiResponse(200, reading, 'Latest reading retrieved successfully')
  );
});

exports.getReadingHistory = AsyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const { limit = 10, offset = 0 } = req.query;
  const data = await sensorService.getReadingHistory(deviceId, limit, offset);
  res.status(200).json(
    new ApiResponse(200, data, 'Reading history retrieved successfully')
  );
});

exports.getReadingStats = AsyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const stats = await sensorService.getReadingStats(deviceId);
  res.status(200).json(new ApiResponse(200, stats, 'Reading stats retrieved successfully'));
});

exports.deleteDeviceReadings = AsyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const result = await sensorService.deleteDeviceReadings(deviceId);
  res.status(200).json(
    new ApiResponse(
      200,
      { deletedCount: result.deletedCount },
      'Device readings deleted successfully'
    )
  );
});
