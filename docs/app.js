let ws;
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

// Generate or retrieve persistent user ID
let userId = localStorage.getItem("userId");
if (!userId) {
  userId = crypto.randomUUID(); // modern browsers
  localStorage.setItem("userId", userId);
}
console.log("Your persistent user ID:", userId);

function connect() {
  ws = new WebSocket("wss://android-web-emulator-zdx5.onrender.com");

  ws.onopen = () => {
    addMessage(`✅ Connected to server! User: ${userId}`);
    ws.send(`Hello from frontend User: ${userId}`);
  };

  ws.onmessage = (msg) => {
    addMessage(`📡 Server says: ${msg.data}`);

    // Placeholder: fill canvas randomly (later replace with real Android frames)
    ctx.fillStyle = "#" + Math.floor(Math.random() * 16777215).toString(16);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  ws.onclose = () => {
    addMessage(`❌ Disconnected from server. User: ${userId}`);
  };

  ws.onerror = (err) => {
    addMessage(`⚠️ WebSocket error: ${err}`);
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
