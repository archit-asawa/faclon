const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://broker.hivemq.com:1883', {
  clientId: 'mqtt-test-publisher',
});

client.on('connect', () => {
  console.log(' Connected to MQTT broker');

  // Publish test messages
  const devices = ['sensor-test-01', 'sensor-test-02', 'sensor-test-03'];
  
  devices.forEach((deviceId, index) => {
    setTimeout(() => {
      const message = {
        temperature: 20 + Math.random() * 15, // Random temp between 20-35
        timestamp: Date.now(),
      };

      const topic = `iot/sensor/${deviceId}/temperature`;
      
      client.publish(topic, JSON.stringify(message), { qos: 1 }, (err) => {
        if (err) {
          console.error(` Failed to publish to ${topic}:`, err);
        } else {
          console.log(`Published to ${topic}:`, message);
        }
      });
    }, index * 2000); // Publish every 2 seconds
  });

  // Disconnect after all messages sent
  setTimeout(() => {
    console.log(' All messages sent. Disconnecting...');
    client.end();
  }, devices.length * 2000 + 1000);
});

client.on('error', (error) => {
  console.error(' MQTT Error:', error);
  client.end();
});
