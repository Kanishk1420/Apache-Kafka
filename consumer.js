const {Kafka} = require('kafkajs');
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});
const group = process.argv[2]
async function init() {
    const consumer = kafka.consumer({ groupId: group });
    await consumer.connect();
    await consumer.subscribe({topics: ['Rider-updates'], fromBeginning: true});
    await consumer.run({
        eachMessage: async ({topic,  partition, message,}) => {
            console.log(`${group}:[${topic}]: PART:${partition}:}`,message.value.toString());
    },
});
}
init().catch(console.error); 