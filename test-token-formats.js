#!/usr/bin/env node
import axios from 'axios';

const ACCESS_TOKEN = '74b8160288a8d1c7a03a982d459d3abaf33981ac';
const STORE_ID = '4611174';

console.log('🔍 Testing different authentication formats...\n');

const testFormats = [
  {
    name: 'Authentication: bearer',
    headers: {
      'Authentication': `bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'TiendaNube-MCP-Test/1.0.0'
    }
  },
  {
    name: 'Authorization: Bearer (capital B)',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'TiendaNube-MCP-Test/1.0.0'
    }
  },
  {
    name: 'Authorization: bearer (lowercase b)',
    headers: {
      'Authorization': `bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'TiendaNube-MCP-Test/1.0.0'
    }
  },
  {
    name: 'Both Authentication and Authorization',
    headers: {
      'Authentication': `bearer ${ACCESS_TOKEN}`,
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'TiendaNube-MCP-Test/1.0.0'
    }
  },
  {
    name: 'X-API-Token header',
    headers: {
      'X-API-Token': ACCESS_TOKEN,
      'Content-Type': 'application/json',
      'User-Agent': 'TiendaNube-MCP-Test/1.0.0'
    }
  }
];

async function testTokenFormats() {
  console.log(`Testing token: ${ACCESS_TOKEN}`);
  console.log(`Store ID: ${STORE_ID}\n`);

  for (const format of testFormats) {
    try {
      console.log(`🧪 Testing: ${format.name}`);
      
      const response = await axios.get(`https://api.tiendanube.com/v1/${STORE_ID}/store`, {
        headers: format.headers,
        timeout: 10000
      });

      console.log(`✅ SUCCESS with ${format.name}`);
      console.log(`Store: ${response.data.name}\n`);
      break; // Stop at first success
      
    } catch (error) {
      console.log(`❌ Failed with ${format.name}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else {
        console.log(`   Error: ${error.message}`);
      }
      console.log('');
    }
  }
}

testTokenFormats();