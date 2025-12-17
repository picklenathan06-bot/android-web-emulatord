class EmulatorManager {
  constructor() {
    this.lastFrameTime = new Map(); // userId -> timestamp
    this.fps = 10; // TARGET FPS
  }

  startEmulator(session) {
    if (session.emulatorRunning) return;

    session.emulatorRunning = true;
    console.log(`▶️ Emulator started for ${session.userId}`);
  }

  stopEmulator(session) {
    session.emulatorRunning = false;
    console.log(`⏹ Emulator stopped for ${session.userId}`);
  }

  sendFakeFrame(session) {
    if (!session.ws || session.ws.readyState !== 1) return;

    const now = Date.now();
    const last = this.lastFrameTime.get(session.userId) || 0;
    const minInterval = 1000 / this.fps;

    if (now - last < minInterval) return;

    this.lastFrameTime.set(session.userId, now);

    session.ws.send(
      JSON.stringify({
        type: "frame",
        userId: session.userId,
        color: `hsl(${Math.random() * 360}, 80%, 50%)`,
        timestamp: now
      })
    );
  }
}

export default new EmulatorManager();
