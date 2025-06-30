# Kafka Producer-Consumer Project

This project is a hands-on implementation of Apache Kafka concepts, inspired by the tutorial from [Piyush Goel](https://www.youtube.com/watch?v=ZJJHm_bd9Zo). It demonstrates a basic real-world scenario of a ride-sharing app where rider location updates are published by a producer and consumed by multiple services.

## 🚀 Concepts Demonstrated

* **Producers**: Applications that publish (write) events to Kafka topics.
* **Consumers**: Applications that subscribe to (read) events from Kafka topics.
* **Topics**: Categories or feed names to which records are published. Similar to a folder in a filesystem.
* **Partitions**: Divisions of a topic that allow for parallel processing and scalability.
* **Consumer Groups**: Collections of consumers that work together to process messages from a topic.
* **Brokers**: Kafka servers that store and manage topics.
* **Zookeeper**: A service that coordinates and manages Kafka brokers.

## 🏛️ Architecture Overview

The diagram below illustrates the fundamental architecture of a Kafka cluster, which is what you are running via Docker.

![Kafka Architecture](https://media.geeksforgeeks.org/wp-content/uploads/20240604175624/Kafka-Architecture-01-01.webp)

*Image credit: [GeeksforGeeks - Kafka Architecture](https://www.geeksforgeeks.org/kafka-architecture/)*

* **Producers** (like our `producer.js`) send records to **Brokers** in the Kafka Cluster.
* The messages are stored in **Topics** (e.g., `Rider-updates`), which are split into **Partitions**.
* **Consumers** (like our `consumer.js`) read records from the brokers. They are organized into **Consumer Groups** to process messages in parallel.
* **Zookeeper** runs in the background to manage the cluster's state, such as tracking which brokers are alive and electing leaders for partitions.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

* [Node.js](https://nodejs.org/en/) (v14 or higher recommended)
* [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose

## ⚙️ Setup & Installation

1. **Clone the Repository**
   
   If you have this project in a git repository, clone it. Otherwise, make sure all the project files are in the same directory.

2. **Install Dependencies**
   
   Open your terminal in the project directory and run the following command to install the required `kafkajs` library:
   
   ```bash
   npm install
   ```

3. **Start Kafka and Zookeeper**
   
   This project uses Docker to run Kafka and its dependency, Zookeeper. Run the following command to start the services in detached mode:
   
   ```bash
   docker-compose up -d
   ```
   
   This will start two containers: `kafka` and `zookeeper`.

## ▶️ Running the Application

Follow these steps in order to see the application in action.

### 1. Create the Kafka Topic

First, you need to create the Kafka topic with its partitions. The `admin.js` script handles this.

Run the script from your terminal:
```bash
node admin.js
```

This will create a topic named `Rider-updates` with 2 partitions.

### 2. Start the Consumer(s)

The `consumer.js` script listens for messages on the `Rider-updates` topic. You can run multiple consumers, and it's recommended to run them in separate terminal windows to observe how Kafka distributes messages.

The script accepts a Consumer Group ID as a command-line argument.

To start a consumer in Group 1:
```bash
node consumer.js Group-1
```

To start another consumer in the same group (in a new terminal):
```bash
node consumer.js Group-1
```

Kafka will balance the partitions between these two consumers.

To start a consumer in a different group (in a new terminal):
```bash
node consumer.js Group-2
```

This consumer group will receive its own copy of all messages.

### 3. Start the Producer and Send Messages

Now, run the `producer.js` script to start sending messages.
```bash
node producer.js
```

The script will prompt you for input. Type a rider's name and a location (north or south) separated by a space, then press Enter.

Example Input:
```
> Piyush north
> Alex south
> Sara north
```

Messages with location `north` will be sent to partition 0.
Messages with any other location (e.g., `south`) will be sent to partition 1.

You will see the consumers in the other terminals printing the messages they receive from the topic.

## 📚 Key Concepts for Beginners

### What is Apache Kafka?
Apache Kafka is an event streaming platform used for high-performance data pipelines, streaming analytics, and data integration. It lets you publish and subscribe to streams of records (messages) in a fault-tolerant, scalable way.

### Message
A unit of data in Kafka. In our example, a message contains rider name, location, and timestamp.

### Partition
Think of partitions like lanes on a highway. More lanes (partitions) allow more traffic (messages) to flow in parallel. In our project, we use the rider's location to determine which partition the message goes to.

### Consumer Group
A way to process messages in parallel. When multiple consumers are in the same group, each consumer receives a portion of the messages. If consumers are in different groups, each group gets a copy of all messages.

### Offset
The position of a message within a partition. Kafka remembers which messages each consumer group has read by storing the offset.

### Producer Acknowledgments
When a producer sends a message, it can request confirmation that the message was received and stored by Kafka. This is crucial for ensuring message delivery.

## 📂 File Structure

* `docker-compose.yml`: Defines the Docker services for Zookeeper and Kafka, making it easy to set up the required infrastructure.
* `package.json`: Lists the project dependencies (only kafkajs).
* `admin.js`: A script to connect to Kafka as an admin and create the `Rider-updates` topic with two partitions.
* `producer.js`: An interactive script that acts as a message producer. It takes user input for a rider's name and location and sends it to the appropriate partition in the `Rider-updates` topic.
* `consumer.js`: A script that acts as a message consumer. It subscribes to the `Rider-updates` topic and logs the messages it receives. It's designed to be run with a consumer group ID.

## 🛑 Stopping the Application

To stop the Kafka and Zookeeper services, run:
```bash
docker-compose down
```

This will stop and remove the containers, but your data will persist in Docker volumes unless you explicitly remove them.

## 🔍 Troubleshooting

### Common Issues

1. **Connection Error**
   
   If you see connection errors, make sure your Docker containers are running:
   ```bash
   docker ps
   ```
   
   You should see both kafka and zookeeper containers running.

2. **Topic Not Found**
   
   If consumers can't find the topic, make sure you've run `admin.js` first to create it.

3. **Message Not Appearing in Consumer**
   
   Check that you're sending messages to the right topic and that your consumer is subscribed to that topic.

### Debugging

You can check Kafka's logs with:
```bash
docker logs kafka
```

And Zookeeper's logs with:
```bash
docker logs zookeeper
```
