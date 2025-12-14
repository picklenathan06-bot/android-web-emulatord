function connect() {
    const ws = new WebSocket("wss://android-web-emulator-zdx5.onrender.com");
  
    ws.onopen = () => {
      addMessage("✅ Connected to server!");
      ws.send("Hello from frontend");
    };
  
    ws.onmessage = (msg) => {
      addMessage("📡 Server says: " + msg.data);
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
