export default {
    launchApp(session, appName) {
      console.log(`Launching PC app "${appName}" for User ${session.userId}`);
      session.currentApp = appName;
  
      // Notify frontend
      if (session.ws && session.ws.readyState === 1) {
        session.ws.send(JSON.stringify({
          type: "system",
          message: `🎮 ${appName} launched!`
        }));
      }
  
      // Track FPS
      let frameCount = 0;
      if (session.fpsInterval) clearInterval(session.fpsInterval);
  
      session.fpsInterval = setInterval(() => {
        if (!session.ws || session.ws.readyState !== 1) return;
        session.ws.send(JSON.stringify({ type: "stats", fps: frameCount }));
        frameCount = 0;
      }, 1000);
  
      // Fake frame streaming (~10 FPS)
      session.appInterval = setInterval(() => {
        if (!session.ws || session.ws.readyState !== 1) return;
  
        session.ws.send(JSON.stringify({
          type: "frame",
          userId: session.userId,
          color: `hsl(${Math.random() * 360}, 80%, 50%)`
        }));
  
        frameCount++;
      }, 100);
    }
  };  