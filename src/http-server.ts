#!/usr/bin/env node

/**
 * Simple HTTP wrapper for Tienda Nube MCP Server
 * Provides an HTTP endpoint at /mcp for the MCP server
 */

import http from "http";
import url from "url";

const port = parseInt(process.env["MCP_PORT"] || "3001", 10);

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url || "", true);

  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (parsedUrl.pathname === "/mcp") {
    // Set headers for Server-Sent Events
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send initial connection message
    const initMessage = {
      jsonrpc: "2.0",
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {},
        },
        serverInfo: {
          name: "Tienda Nube MCP Server",
          version: "1.5.0",
        },
      },
    };

    res.write(`data: ${JSON.stringify(initMessage)}\n\n`);

    // Keep connection alive
    const keepAlive = setInterval(() => {
      res.write(": keepalive\n\n");
    }, 30000);

    req.on("close", () => {
      clearInterval(keepAlive);
    });
  } else if (parsedUrl.pathname === "/health") {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(
      JSON.stringify({
        status: "healthy",
        service: "Tienda Nube MCP Server HTTP",
        version: "1.5.0",
        endpoint: `/mcp`,
      })
    );
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(port, () => {
  console.log(
    `Tienda Nube MCP HTTP Server running at http://localhost:${port}`
  );
  console.log(`MCP endpoint: http://localhost:${port}/mcp`);
  console.log(`Health check: http://localhost:${port}/health`);
});

process.on("SIGINT", () => {
  console.log("\nShutting down HTTP server...");
  server.close();
  process.exit(0);
});
