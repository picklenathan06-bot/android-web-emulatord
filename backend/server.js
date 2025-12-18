import { WebSocketServer } from "ws";
import sessionManager from "./sessionManager.js";
import pcAppManager from "./pcAppManager.js";

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`🚀 WebSocket server running on port ${PORT}`);

wss.on("connection", (ws) => {
  let userId = null;

  ws.on("message", (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch {
      console.log("⚠️ Invalid JSON");
      return;
    }

    const session = sessionManager.getOrCreateSession(data.userId, ws);

    switch (data.type) {
      // First message from frontend
      case "hello":
        userId = data.userId;
        ws.send(JSON.stringify({
          type: "system",
          message: `Hello User ${userId}, session ready`
        }));
        break;

      // Launch PC app from side panel
      case "launchApp":
        if (session.appInterval) clearInterval(session.appInterval);
        pcAppManager.launchApp(session, data.app);
        break;

      // Keyboard / mouse input
      case "input":
        console.log(`🎮 Input from ${data.userId}:`, data.action, data);
        break;
    }
  });

  ws.on("close", () => {
    const session = sessionManager.getOrCreateSession(userId, ws);
    if (session.appInterval) clearInterval(session.appInterval);
    if (session.fpsInterval) clearInterval(session.fpsInterval);
    if (userId) sessionManager.removeSession(userId);
  });
});