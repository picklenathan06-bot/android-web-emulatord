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
        emulatorRunning: false,
        appInterval: null,
        fpsInterval: null,
        currentApp: null
      });

      console.log(`🆕 Session created for user ${userId}`);
    } else {
      const session = this.sessions.get(userId);
      session.ws = ws; // update ws if reconnecting
    }

    return this.sessions.get(userId);
  }

  removeSession(userId) {
    const session = this.sessions.get(userId);
    if (!session) return;

    if (session.appInterval) clearInterval(session.appInterval);
    if (session.fpsInterval) clearInterval(session.fpsInterval);

    console.log(`❌ Session removed for user ${userId}`);
    this.sessions.delete(userId);
  }
}

export default new SessionManager();