const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'deviceId is required'],
      trim: true,
      index: true,
    },
    temperature: {
      type: Number,
      required: [true, 'temperature is required'],
      validate: {
        validator: (v) => v >= -50 && v <= 150,
        message: 'temperature must be between -50 and 150 degrees Celsius',
      },
    },
    timestamp: {
      type: Number,
      required: [true, 'timestamp is required'],
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Compound index on deviceId and timestamp
sensorReadingSchema.index({ deviceId: 1, timestamp: -1 });

// Middleware for logging
sensorReadingSchema.pre('save', function (next) {
  if (this.isNew) {
    console.log(`Creating new sensor reading for device: ${this.deviceId}`);
  }
  next();
});

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
