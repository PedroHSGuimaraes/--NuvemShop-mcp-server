#!/usr/bin/env node
import axios from 'axios';

const ACCESS_TOKEN = '74b8160288a8d1c7a03a982d459d3abaf33981ac';
const STORE_ID = '4611174';

console.log('🔍 Testing Tienda Nube API credentials...\n');

async function testCredentials() {
  try {
    console.log('📋 Testing store info endpoint:');
    console.log(`URL: https://api.tiendanube.com/v1/${STORE_ID}/store`);
    console.log(`Token: ${ACCESS_TOKEN.substring(0, 8)}...${ACCESS_TOKEN.substring(-4)}\n`);

    // Test 1: Store info (most basic endpoint)
    const storeResponse = await axios.get(`https://api.tiendanube.com/v1/${STORE_ID}/store`, {
      headers: {
        'Authentication': `bearer ${ACCESS_TOKEN}`,
        'Authorization': `bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'TiendaNube-MCP-Test/1.0.0'
      },
      timeout: 10000
    });

    console.log('✅ Store API Test - SUCCESS');
    console.log(`Store Name: ${storeResponse.data.name}`);
    console.log(`Store ID: ${storeResponse.data.id}`);
    console.log(`Plan: ${storeResponse.data.plan_name}\n`);

    // Test 2: Products endpoint 
    console.log('📦 Testing products endpoint...');
    const productsResponse = await axios.get(`https://api.tiendanube.com/v1/${STORE_ID}/products`, {
      headers: {
        'Authentication': `bearer ${ACCESS_TOKEN}`,
        'Authorization': `bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'TiendaNube-MCP-Test/1.0.0'
      },
      params: { per_page: 1 },
      timeout: 10000
    });

    console.log('✅ Products API Test - SUCCESS');
    console.log(`Found ${productsResponse.data.length} products\n`);

    console.log('🎉 All tests passed! Your credentials are working correctly.');

  } catch (error) {
    console.error('❌ API Test Failed:');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Status Text: ${error.response.statusText}`);
      console.error(`Data:`, error.response.data);
      console.error(`Headers:`, error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request error:', error.message);
    }
    
    process.exit(1);
  }
}

testCredentials();