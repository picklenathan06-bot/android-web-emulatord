class EmulatorManager {
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
  
      session.ws.send(
        JSON.stringify({
          type: "frame",
          userId: session.userId,
          color: `hsl(${Math.random() * 360}, 80%, 50%)`
        })
      );
    }
  }
  
  export default new EmulatorManager();
  