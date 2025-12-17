import { WebSocketServer } from "ws";
import sessionManager from "./sessionManager.js";
import emulatorManager from "./emulatorManager.js";

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`🚀 WebSocket server running on port ${PORT}`);

wss.on("connection", (ws) => {
  let userId = null;
  let frameInterval = null;

  ws.on("message", (message) => {
    let data;

    try {
      data = JSON.parse(message);
    } catch {
      console.log("⚠️ Invalid JSON");
      return;
    }

    // HELLO message (first message)
    if (data.type === "hello") {
      userId = data.userId;

      const session = sessionManager.getOrCreateSession(userId, ws);
      emulatorManager.startEmulator(session);

      ws.send(
        JSON.stringify({
          type: "system",
          message: `Hello User ${userId}, session ready`
        })
      );

      // Fake frame stream (10 FPS)
      frameInterval = setInterval(() => {
        emulatorManager.sendFakeFrame(session);
      }, 100);
    }

    // INPUT messages
    if (data.type === "input") {
      console.log(
        `🎮 Input from ${data.userId}:`,
        data.action,
        data
      );
    }
  });

  ws.on("close", () => {
    if (frameInterval) clearInterval(frameInterval);
    if (userId) sessionManager.removeSession(userId);
  });
});