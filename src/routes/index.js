const express = require('express');
const sensorRoutes = require('./sensor.routes');

const router = express.Router();

router.use('/sensor', sensorRoutes);

module.exports = router;
