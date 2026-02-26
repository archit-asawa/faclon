# IoT Sensor Backend

Production-grade Node.js backend for IoT temperature sensor data ingestion with MongoDB, MQTT support, comprehensive validation, and error handling.

🚀 **Live Demo:** https://faclon.onrender.com

## Tech Stack

- **Node.js + Express** - REST API
- **MongoDB + Mongoose** - Database
- **MQTT** - Real-time data ingestion
- **Joi** - Input validation
- **Winston** - Logging
- **Jest + Supertest** - Testing

## Quick Setup

```bash
# 1. Clone repository
git clone https://github.com/archit-asawa/faclon.git
cd faclon

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and add your MongoDB Atlas URI:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iot-sensors

# 4. Start server
npm run dev        # Development with auto-reload
npm start          # Production mode
npm test           # Run tests
```

---

## API Endpoints - Production

**Base URL:** `https://faclon.onrender.com`

### 1. Health Check
**GET** `/health`

```bash
curl https://faclon.onrender.com/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-02-26T12:00:00.000Z",
    "uptime": 3600
  }
}
```

---

### 2. Ingest Sensor Reading
**POST** `/api/v1/sensor/ingest`

**Request Body:**
```json
{
  "deviceId": "sensor-01",
  "temperature": 25.5,
  "timestamp": 1705312440000
}
```

**CURL:**
```bash
curl -X POST https://faclon.onrender.com/api/v1/sensor/ingest \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"sensor-01","temperature":25.5}'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Sensor reading ingested successfully",
  "data": {
    "_id": "699fe99cdb509c969370401d",
    "deviceId": "sensor-01",
    "temperature": 25.5,
    "timestamp": 1740508790000,
    "createdAt": "2026-02-26T12:00:00.000Z"
  }
}
```

---

### 3. Get Latest Reading
**GET** `/api/v1/sensor/:deviceId/latest`

**CURL:**
```bash
curl https://faclon.onrender.com/api/v1/sensor/sensor-01/latest
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deviceId": "sensor-01",
    "temperature": 25.5,
    "timestamp": 1740508790000,
    "createdAt": "2026-02-26T12:00:00.000Z"
  }
}
```

---

### 4. Get Reading History
**GET** `/api/v1/sensor/:deviceId/history?limit=10&offset=0`

**CURL:**
```bash
curl "https://faclon.onrender.com/api/v1/sensor/sensor-01/history?limit=10&offset=0"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "readings": [...],
    "total": 150,
    "limit": 10,
    "offset": 0
  }
}
```

---

### 5. Get Statistics
**GET** `/api/v1/sensor/:deviceId/stats`

**CURL:**
```bash
curl https://faclon.onrender.com/api/v1/sensor/sensor-01/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "sensor-01",
    "minTemp": 20.5,
    "maxTemp": 35.2,
    "avgTemp": 27.8,
    "count": 150
  }
}
```

---

### 6. Delete Device Readings
**DELETE** `/api/v1/sensor/:deviceId`

**CURL:**
```bash
curl -X DELETE https://faclon.onrender.com/api/v1/sensor/sensor-01
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deletedCount": 150
  }
}
```

---

## API Endpoints - Local Development

**Base URL:** `http://localhost:3000`

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Ingest Sensor Reading
```bash
curl -X POST http://localhost:3000/api/v1/sensor/ingest \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"sensor-01","temperature":25.5}'
```

### 3. Get Latest Reading
```bash
curl http://localhost:3000/api/v1/sensor/sensor-01/latest
```

### 4. Get Reading History
```bash
curl "http://localhost:3000/api/v1/sensor/sensor-01/history?limit=10&offset=0"
```

### 5. Get Statistics
```bash
curl http://localhost:3000/api/v1/sensor/sensor-01/stats
```

### 6. Delete Device Readings
```bash
curl -X DELETE http://localhost:3000/api/v1/sensor/sensor-01
```

---

## Validation Rules

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `deviceId` | String | Yes | 3-50 chars, alphanumeric + hyphens |
| `temperature` | Number | Yes | -50 to 150 (Celsius) |
| `timestamp` | Number | No | Unix timestamp (ms), defaults to now |

## Error Responses

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": ["temperature must not exceed 150°C"]
  }
}
```

**Status Codes:** `200` OK, `201` Created, `400` Bad Request, `404` Not Found, `429` Rate Limited, `500` Server Error

---

## MQTT Integration

### Setup
Edit `.env`:
```env
MQTT_BROKER_URL=mqtt://broker.hivemq.com:1883
MQTT_CLIENT_ID=iot-backend-service
MQTT_TOPIC_PATTERN=iot/sensor/+/temperature
```

### Publish Message
**Topic:** `iot/sensor/{deviceId}/temperature`

```bash
# Using MQTT CLI
mqtt pub -t "iot/sensor/sensor-02/temperature" -h "broker.hivemq.com" -m "{\"temperature\":28.5}"

# Using test script
node test-mqtt.js
```

**Message Format:**
```json
{
  "temperature": 28.5,
  "timestamp": 1740508790000
}
```

Backend automatically ingests MQTT messages into MongoDB.

---

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm test -- --coverage # With coverage
```

**Test Results:** 11/11 passing (60% coverage)

---

## Environment Variables

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/iot-sensors
MQTT_BROKER_URL=mqtt://broker.hivemq.com:1883
LOG_LEVEL=info
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Project Structure

```
src/
├── config/         # DB, MQTT, env config
├── models/         # Mongoose schemas
├── controllers/    # Request handlers
├── services/       # Business logic
├── routes/         # API routes
├── middlewares/    # Validation, error handling
├── utils/          # Logger, helpers
└── validators/     # Joi schemas
```

---

## Features

✅ RESTful API with Express  
✅ MongoDB with connection pooling  
✅ MQTT real-time ingestion  
✅ Input validation (Joi)  
✅ Centralized error handling  
✅ Winston logging (file + console)  
✅ Rate limiting (100 req/min)  
✅ Security headers (Helmet)  
✅ CORS enabled  
✅ Unit + Integration tests  
✅ 60% code coverage  

---

## Troubleshooting

**MongoDB Auth Error:**
- Check MONGODB_URI credentials in `.env`
- Whitelist your IP in MongoDB Atlas

**MQTT Not Working:**
- Check backend logs for "MQTT connected successfully"
- Ensure JSON is properly formatted: `{"temperature":28.5}`

**Port In Use:**
```bash
PORT=3001 npm run dev
```

---

