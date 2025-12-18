import { createCanvas } from "canvas"; // headless canvas for placeholder frames

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

    // Frame streaming (~10 FPS)
    if (session.appInterval) clearInterval(session.appInterval);

    session.appInterval = setInterval(async () => {
      if (!session.ws || session.ws.readyState !== 1) return;

      const frame = await this.captureFrame(appName);

      session.ws.send(JSON.stringify({
        type: "frame",
        userId: session.userId,
        image: frame // base64 PNG
      }));

      frameCount++;
    }, 100);
  },

  /**
   * Placeholder frame capture. Replace with real app capture later.
   */
  async captureFrame(appName) {
    const width = 800;
    const height = 450;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Random color background
    ctx.fillStyle = `hsl(${Math.random() * 360}, 80%, 50%)`;
    ctx.fillRect(0, 0, width, height);

    // App name overlay
    ctx.fillStyle = "#fff";
    ctx.font = "30px sans-serif";
    ctx.fillText(appName, 20, 50);

    return canvas.toDataURL().split(",")[1]; // base64 PNG string
  }
};
