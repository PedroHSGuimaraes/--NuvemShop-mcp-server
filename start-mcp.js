#!/usr/bin/env node

/**
 * MCP Server Launcher for N8N
 * This script ensures proper environment setup and error handling for N8N integration
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get environment variables
const accessToken = process.env.TIENDANUBE_ACCESS_TOKEN;
const storeId = process.env.TIENDANUBE_STORE_ID;

if (!accessToken || !storeId) {
  console.error('Error: Missing required environment variables');
  console.error('TIENDANUBE_ACCESS_TOKEN and TIENDANUBE_STORE_ID are required');
  process.exit(1);
}

// Path to the main server file
const serverPath = path.join(__dirname, 'dist', 'index.js');

// Create child process with proper environment
const child = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: {
    ...process.env,
    TIENDANUBE_ACCESS_TOKEN: accessToken,
    TIENDANUBE_STORE_ID: storeId,
    NODE_ENV: process.env.NODE_ENV || 'production'
  }
});

// Forward stdin/stdout for MCP communication
process.stdin.pipe(child.stdin);
child.stdout.pipe(process.stdout);

// Log errors to stderr
child.stderr.on('data', (data) => {
  console.error(data.toString());
});

// Handle child process exit
child.on('exit', (code, signal) => {
  if (code !== 0) {
    console.error(`MCP Server exited with code ${code}, signal ${signal}`);
  }
  process.exit(code || 0);
});

// Handle parent process termination
process.on('SIGINT', () => {
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});
