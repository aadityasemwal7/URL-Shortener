const { createClient } = require("redis")

const client = createClient({
    socket: {
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || 6379,
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
    },
});

let isConnected = false;

client.on("error", (error) => {
    console.error("Redis error:", error?.message || error || "Unknown error");
    isConnected = false;
});

client.on("connect", () => {
    console.log("Redis connected successfully!");
});

client.on("ready", () => {
    console.log("Redis client ready!");
    isConnected = true;
});

const connectRedis = async() => {
    try {
        await client.connect();
        console.log("Redis client connected!")
    } catch (error) {
        console.error("Failed to connect to Redis:", error?.message || error);
        console.warn("⚠️  Continuing without Redis caching. Install Redis to enable caching.");
        // Don't throw - allow app to work without Redis
    }
}

const ensureConnected = async () => {
    if (!isConnected && !client.isOpen) {
        await connectRedis();
    }
}

module.exports = {client, connectRedis, ensureConnected, isConnected: () => isConnected};