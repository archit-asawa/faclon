# Quick Start Commands

Run these commands in your terminal one by one:

## 1. Navigate to project directory
```
cd d:\Faclonlabs\iot-sensor-backend
```

## 2. Install dependencies
```
npm install
```

## 3. Create .env file from example
```
copy .env.example .env
```

## 4. Edit .env file with your MongoDB URI
- Open .env in your editor
- Replace MongoDB connection string:
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iot-sensors?retryWrites=true&w=majority
  ```

## 5. Start development server
```
npm run dev
```

## 6. Test the server (in another terminal)
```
curl http://localhost:3000/health
```

## Optional: Run tests
```
npm test
```

## Optional: Lint and format code
```
npm run lint
npm run format
```

---

## Key Endpoints to Test

### Health Check
```
curl http://localhost:3000/health
```

### Ingest Sensor Reading
```
curl -X POST http://localhost:3000/api/v1/sensor/ingest \
  -H "Content-Type: application/json" \
  -d "{\"deviceId\": \"sensor-01\", \"temperature\": 25.5}"
```

### Get Latest Reading
```
curl http://localhost:3000/api/v1/sensor/sensor-01/latest
```

### Get Statistics
```
curl http://localhost:3000/api/v1/sensor/sensor-01/stats
```

---

That's it! Your production-grade IoT backend is ready.
