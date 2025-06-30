const { Kafka } = require("kafkajs");
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function init() {
  const producer = kafka.producer();
  console.log("Connecting to Producer...");
  await producer.connect();
  console.log("Connected to Producer Successfully");
  
  rl.setPrompt("> ");
  rl.prompt();

  rl.on("line", async (line) => {
    const [riderName, location] = line.split(" ");
    if (!riderName || !location) {
      console.log("Please provide both rider name and location (e.g., 'John north')");
      rl.prompt();
      return;
    }

    try {
      await producer.send({
        topic: "Rider-updates",
        messages: [
          {
            partition: location.toLowerCase() === "north" ? 0 : 1,
            key: "location-update",
            value: JSON.stringify({
              name: riderName,
              location: location,
              timestamp: new Date().toISOString(),
            }),
          },
        ],
      });
      console.log(`Message sent: ${riderName} at ${location}`);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    
    rl.prompt();
  });

  rl.on("close", async () => {
    console.log("Disconnecting producer...");
    await producer.disconnect();
    console.log("Producer disconnected");
  });
}

init().catch(console.error);
