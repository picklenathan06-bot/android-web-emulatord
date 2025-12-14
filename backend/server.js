import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });
const clients = new Map(); // Map ws -> userId

function generateFakeFrame(userId) {
  // Example: random color for each frame
  const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  return JSON.stringify({ type: "frame", color, userId });
}

wss.on("connection", (ws) => {
  let userId = null;

  ws.on("message", (msg) => {
    const text = msg.toString();

    // Extract userId from message
    const match = text.match(/User: (.+)$/);
    if (match) userId = match[1];

    clients.set(ws, userId);

    console.log(`Received from User ${userId}: ${text}`);

    // Send a frame back to this user only
    if (ws.readyState === 1) {
      ws.send(generateFakeFrame(userId));
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log(`Client disconnected. User: ${userId}`);
  });
});

console.log("WebSocket server running");
