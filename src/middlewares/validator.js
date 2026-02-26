const ApiError = require('../utils/apiError');
const { validateSensorReading } = require('../validators/sensor.validator');

const validateSensorReadingMiddleware = (req, _res, next) => {
  const { error, value } = validateSensorReading(req.body);

  if (error) {
    const details = error.details.map((detail) => detail.message);
    return next(new ApiError(400, 'Validation failed', details));
  }

  req.body = value;
  next();
};

module.exports = validateSensorReadingMiddleware;
