let ws;
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

function connect() {
  ws = new WebSocket("wss://android-web-emulator-zdx5.onrender.com");

  ws.onopen = () => {
    addMessage("✅ Connected to server!");
    ws.send("Hello from frontend");
  };

  ws.onmessage = (msg) => {
    addMessage("📡 Server says: " + msg.data);

    // Example: fill the canvas with a color based on server message (placeholder)
    ctx.fillStyle = "#" + Math.floor(Math.random()*16777215).toString(16);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  ws.onclose = () => {
    addMessage("❌ Disconnected from server");
  };

  ws.onerror = (err) => {
    addMessage("⚠️ WebSocket error: " + err);
    console.error(err);
  };
}

function addMessage(text) {
  const div = document.getElementById("messages");
  const p = document.createElement("p");
  p.textContent = text;
  div.appendChild(p);
  div.scrollTop = div.scrollHeight;
}
