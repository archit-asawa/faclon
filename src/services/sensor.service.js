const SensorReading = require('../models/SensorReading.model');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

exports.createReading = async (data) => {
  try {
    if (!data.timestamp) {
      data.timestamp = Date.now();
    }

    const reading = await SensorReading.create(data);
    logger.info(`Sensor reading created: ${reading._id}`, {
      deviceId: data.deviceId,
      temperature: data.temperature,
    });
    return reading;
  } catch (error) {
    logger.error('Error creating sensor reading', error);
    throw new ApiError(400, 'Failed to create sensor reading', [error.message]);
  }
};

exports.getLatestReading = async (deviceId) => {
  try {
    const latestReading = await SensorReading.findOne({ deviceId })
      .sort({ timestamp: -1 })
      .lean();

    if (!latestReading) {
      throw new ApiError(404, `No readings found for device ${deviceId}`);
    }

    return latestReading;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Error fetching latest reading', error);
    throw new ApiError(500, 'Failed to fetch latest reading');
  }
};

exports.getReadingHistory = async (deviceId, limit = 10, offset = 0) => {
  try {
    const readings = await SensorReading.find({ deviceId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit, 10))
      .skip(parseInt(offset, 10))
      .lean();

    const total = await SensorReading.countDocuments({ deviceId });

    return { readings, total, limit: parseInt(limit, 10), offset: parseInt(offset, 10) };
  } catch (error) {
    logger.error('Error fetching reading history', error);
    throw new ApiError(500, 'Failed to fetch reading history');
  }
};

exports.getReadingStats = async (deviceId) => {
  try {
    const stats = await SensorReading.aggregate([
      { $match: { deviceId } },
      {
        $group: {
          _id: '$deviceId',
          minTemp: { $min: '$temperature' },
          maxTemp: { $max: '$temperature' },
          avgTemp: { $avg: '$temperature' },
          count: { $sum: 1 },
        },
      },
    ]);

    if (stats.length === 0) {
      throw new ApiError(404, `No readings found for device ${deviceId}`);
    }

    return stats[0];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Error fetching reading stats', error);
    throw new ApiError(500, 'Failed to fetch reading stats');
  }
};

exports.deleteDeviceReadings = async (deviceId) => {
  try {
    const result = await SensorReading.deleteMany({ deviceId });
    logger.info(`Deleted readings for device: ${deviceId}`, { deletedCount: result.deletedCount });
    return result;
  } catch (error) {
    logger.error('Error deleting device readings', error);
    throw new ApiError(500, 'Failed to delete device readings');
  }
};
