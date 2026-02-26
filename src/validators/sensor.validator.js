const Joi = require('joi');

const sensorReadingSchema = Joi.object({
  deviceId: Joi.string()
    .required()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9-]+$/)
    .trim()
    .messages({
      'string.pattern.base': 'deviceId must contain only alphanumeric characters and hyphens',
      'string.empty': 'deviceId is required',
    }),
  temperature: Joi.number()
    .required()
    .min(-50)
    .max(150)
    .messages({
      'number.min': 'temperature must be at least -50°C',
      'number.max': 'temperature must not exceed 150°C',
    }),
  timestamp: Joi.number()
    .optional()
    .positive()
    .messages({
      'number.positive': 'timestamp must be a positive number',
    }),
});

const validateSensorReading = (data) => {
  return sensorReadingSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
};

module.exports = {
  validateSensorReading,
};
