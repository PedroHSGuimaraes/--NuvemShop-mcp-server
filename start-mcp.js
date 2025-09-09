#!/usr/bin/env node

// Simple wrapper to start the MCP server with proper environment
import { exec } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverPath = path.join(__dirname, "dist", "index.js");

// Start the server directly
exec(
  `node "${serverPath}"`,
  {
    env: process.env,
    stdio: "inherit",
  },
  (error) => {
    if (error) {
      console.error("Failed to start MCP server:", error);
      process.exit(1);
    }
  }
);
