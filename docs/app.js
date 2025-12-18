let ws;
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

let userId = localStorage.getItem("userId");
if (!userId) {
  userId = crypto.randomUUID();
  localStorage.setItem("userId", userId);
}

function connect() {
  ws = new WebSocket("wss://android-web-emulator-zdx5.onrender.com");
  addMessage(`🔄 Connecting to server with User: ${userId}`);

  ws.onopen = () => {
    addMessage(`✅ Connected to server! User: ${userId}`);
    ws.send(JSON.stringify({ type: "hello", userId }));
  };

  ws.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);

      if (data.type === "frame" && data.userId === userId) {
        if (data.image) {
          const img = new Image();
          img.src = `data:image/png;base64,${data.image}`;
          img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = data.color;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      } else if (data.type === "stats") {
        addMessage(`📊 Server FPS: ${data.fps}`);
      } else if (data.type === "system") {
        addMessage(`📡 ${data.message}`);
      }
    } catch (err) {
      console.error("Invalid message:", msg.data);
    }
  };

  ws.onclose = () => {
    addMessage(`❌ Disconnected from server. User: ${userId}`);
  };
}

function launchApp(appName) {
  if (!ws || ws.readyState !== 1) return;
  ws.send(JSON.stringify({ type: "launchApp", userId, app: appName }));
  addMessage(`🎮 Launching ${appName}...`);
}

// Keyboard input
document.addEventListener("keydown", (e) => {
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify({
      type: "input",
      userId,
      action: "keydown",
      key: e.key
    }));
  }
});

// Mouse click on canvas
canvas.addEventListener("click", (e) => {
  if (ws && ws.readyState === 1) {
    const rect = canvas.getBoundingClientRect();
    ws.send(JSON.stringify({
      type: "input",
      userId,
      action: "click",
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }));
  }
});

function addMessage(text) {
  const div = document.getElementById("messages");
  const p = document.createElement("p");
  p.textContent = text;
  div.appendChild(p);
  div.scrollTop = div.scrollHeight;
}

connect();
