#!/usr/bin/env node

// Test script to validate MCP server connection
const { spawn } = require('child_process');

console.log('Testing MCP Server Connection...');

const serverProcess = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'inherit'],
  env: {
    ...process.env,
    TIENDANUBE_ACCESS_TOKEN: 'test_token',
    TIENDANUBE_STORE_ID: 'test_store',
    NODE_ENV: 'production'
  }
});

// Send initialization message
const initMessage = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: {
      name: "test-client",
      version: "1.0.0"
    }
  }
};

setTimeout(() => {
  console.log('Sending initialize message...');
  serverProcess.stdin.write(JSON.stringify(initMessage) + '\n');
}, 1000);

serverProcess.stdout.on('data', (data) => {
  console.log('Server response:', data.toString());
});

serverProcess.on('error', (error) => {
  console.error('Server error:', error);
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Cleanup after 10 seconds
setTimeout(() => {
  console.log('Test completed, shutting down...');
  serverProcess.kill();
}, 10000);
