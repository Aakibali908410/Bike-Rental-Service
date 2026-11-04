import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve .env from multiple candidate locations so the backend can start
// from either the backend directory or the project root.
const candidatePaths = [
  path.resolve(__dirname, "../../.env"), // backend/.env relative to src/config/
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend/.env"),
];

let loadedPath = null;
for (const envPath of candidatePaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    loadedPath = envPath;
    break;
  }
}

// Fallback to standard dotenv.config() if no candidate matched
if (!loadedPath) {
  dotenv.config();
}

/**
 * Returns safe diagnostic info about OpenAI configuration without exposing any secret keys.
 */
export const getOpenAiDiagnostic = () => {
  const rawKey = process.env.OPENAI_API_KEY;
  const isConfigured = Boolean(
    rawKey &&
    typeof rawKey === "string" &&
    rawKey.trim() !== "" &&
    rawKey.trim() !== "your_openai_api_key_here"
  );

  return {
    isConfigured,
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  };
};

export default {
  getOpenAiDiagnostic,
};

