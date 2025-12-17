import { v4 as uuidv4 } from "uuid";

class SessionManager {
  constructor() {
    this.sessions = new Map(); // userId -> session
  }

  getOrCreateSession(userId, ws) {
    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, {
        sessionId: uuidv4(),
        userId,
        ws,
        createdAt: Date.now(),
        emulatorRunning: false
      });

      console.log(`🆕 Session created for user ${userId}`);
    }

    return this.sessions.get(userId);
  }

  removeSession(userId) {
    if (this.sessions.has(userId)) {
      console.log(`❌ Session removed for user ${userId}`);
      this.sessions.delete(userId);
    }
  }
}

export default new SessionManager();
