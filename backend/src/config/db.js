import dns from "node:dns";
import mongoose from "mongoose";

// Node.js on Windows often fails mongodb+srv SRV lookups with
// "querySrv ECONNREFUSED". Public DNS avoids the broken local resolver.
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL;

  if (!uri) {
    console.error("MongoDB connection failed: MONGODB_URI is missing from environment variables.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
