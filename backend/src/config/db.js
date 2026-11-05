import dns from "node:dns";
import mongoose from "mongoose";

// Node.js on Windows often fails mongodb+srv SRV lookups with
// "querySrv ECONNREFUSED". Use public DNS only on Windows to preserve cloud container DNS on Linux/Render.
if (process.platform === "win32") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch {
    // ignore
  }
}

try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // ignore if not supported in runtime
}

/**
 * Safely masks database credentials (username and password) for error logging.
 * Example: mongodb+srv://myuser:secret123@cluster0.abc.mongodb.net/dbname
 * Returns: mongodb+srv://***:***@cluster0.abc.mongodb.net/dbname
 */
export const maskMongoUri = (uri) => {
  if (!uri || typeof uri !== "string") return "[empty]";
  return uri.replace(
    /(mongodb(?:\+srv)?:\/\/)([^:@\s]+):([^@\s]+)@/i,
    "$1***:***@"
  );
};

/**
 * Validates and sanitizes the MongoDB connection URI from environment variables.
 * Automatically corrects common copy-paste errors (wrapping quotes, accidental variable prefixes, whitespace).
 */
export const getSanitizedMongoUri = () => {
  // Check primary variable MONGODB_URI first, followed by standard fallback names
  const raw =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.MONGO_URL ||
    process.env.DATABASE_URL;

  if (!raw || typeof raw !== "string") {
    return {
      isValid: false,
      reason: "MISSING",
      message:
        "MongoDB connection string is missing. Please set MONGODB_URI in your environment variables (e.g., in the Render Dashboard -> Environment).",
    };
  }

  let cleaned = raw.trim();

  // Strip wrapping quotes: "mongodb+srv://..." or 'mongodb+srv://...'
  cleaned = cleaned.replace(/^["']|["']$/g, "").trim();

  // Strip accidental variable name prefix if copied into the value box on Render: MONGODB_URI=mongodb+srv://...
  cleaned = cleaned.replace(/^(MONGODB_URI|MONGO_URI|MONGO_URL|DATABASE_URL)\s*=\s*/i, "").trim();

  // Re-strip any quotes exposed after removing variable name
  cleaned = cleaned.replace(/^["']|["']$/g, "").trim();

  // Validate scheme: must start with mongodb:// or mongodb+srv://
  if (!cleaned.startsWith("mongodb://") && !cleaned.startsWith("mongodb+srv://")) {
    return {
      isValid: false,
      reason: "INVALID_SCHEME",
      message:
        'Invalid scheme: Connection string must start with "mongodb://" or "mongodb+srv://". If copying from MongoDB Atlas, ensure the full URL was copied (including the "mongodb+srv://" prefix).',
    };
  }

  return {
    isValid: true,
    uri: cleaned,
  };
};

const connectDB = async () => {
  const result = getSanitizedMongoUri();

  if (!result.isValid) {
    console.error(`\n=============================================================`);
    console.error(`[MongoDB Configuration Error]`);
    console.error(result.message);
    console.error(`Expected Key:   MONGODB_URI`);
    console.error(`Expected Format: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority`);
    console.error(`Action Required: Open Render Dashboard -> Environment -> Set MONGODB_URI`);
    console.error(`=============================================================\n`);
    process.exit(1);
  }

  const { uri } = result;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`\n=============================================================`);
    console.error(`[MongoDB Connection Error] Failed to connect to MongoDB cluster:`);
    console.error(`Target Host: ${maskMongoUri(uri)}`);
    console.error(`Error:       ${error.message}`);
    if (/ETIMEDOUT|ECONNREFUSED|ENOTFOUND/i.test(error.message)) {
      console.error(`Tip: In MongoDB Atlas, go to "Network Access" and ensure "0.0.0.0/0" is whitelisted so Render can connect.`);
    } else if (/bad auth|authentication failed/i.test(error.message)) {
      console.error(`Tip: In MongoDB Atlas, check that your Database User password is correct and has readWrite permissions.`);
    }
    console.error(`=============================================================\n`);
    process.exit(1);
  }
};

export default connectDB;
