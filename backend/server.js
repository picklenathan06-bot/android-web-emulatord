import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });
const clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);
  console.log("Client connected. Total clients:", clients.size);

  ws.on("message", (msg) => {
    console.log("Received:", msg.toString());

    // Broadcast the message to all connected clients
    for (const client of clients) {
      if (client.readyState === 1) {
        client.send(msg.toString());
      }
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("Client disconnected. Total clients:", clients.size);
  });
});

console.log("WebSocket server running");
