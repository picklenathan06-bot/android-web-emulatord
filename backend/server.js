import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });
const clients = new Map(); // Map each client to its ID

wss.on("connection", (ws) => {
  let userId = null;

  ws.on("message", (msg) => {
    const text = msg.toString();

    // Extract userId from message (simple pattern)
    const match = text.match(/User: (.+)$/);
    if (match) userId = match[1];

    clients.set(ws, userId);

    console.log(`Received from User ${userId}: ${text}`);

    // Reply personally
    if (ws.readyState === 1) {
      ws.send(`Hello User ${userId}, message received: "${text}"`);
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log(`Client disconnected. User: ${userId}`);
  });
});

console.log("WebSocket server running");
