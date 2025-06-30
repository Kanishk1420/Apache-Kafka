const {Kafka} = require('kafkajs');
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});
async function init(){
    const admin = kafka.admin();
    console.log('Connecting to Kafka...');
    await admin.connect();
    console.log('Connected to Kafka');
    // create topic
    console.log('Creating topic: Rider-updates');
    
    // Add await here to wait for topic creation to complete
    await admin.createTopics({
        topics:[{
            topic:"Rider-updates",
            numPartitions: 2,
        }],
    });
    console.log('Topic created: Rider-updates');

    console.log('Disconnecting from Kafka'); // Also updated this message
    await admin.disconnect();
}
init().catch(console.error);