let ws;
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

let userId = localStorage.getItem("userId");
if (!userId) {
  userId = crypto.randomUUID();
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
    try {
      const data = JSON.parse(msg.data);

      if (data.type === "frame") {
        // Only draw frames meant for this user
        if (data.userId === userId) {
          ctx.fillStyle = data.color; // placeholder frame
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      } else {
        addMessage(`📡 Server says: ${msg.data}`);
      }
    } catch (err) {
      console.error("Invalid message:", msg.data);
    }
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

// Optional: send keyboard or mouse input
document.addEventListener("keydown", (e) => {
  if (ws && ws.readyState === 1) {
    ws.send(`Input from User: ${userId} KeyDown: ${e.key}`);
  }
});

canvas.addEventListener("click", (e) => {
  if (ws && ws.readyState === 1) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ws.send(`Input from User: ${userId} Click: ${x},${y}`);
  }
});
