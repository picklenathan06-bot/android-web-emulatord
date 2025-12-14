function connect() {
    const ws = new WebSocket("wss://android-web-emulator-zdx5.onrender.com");
  
    ws.onopen = () => {
      console.log("Connected to server!");
      ws.send("Hello from frontend");
      addMessage("Connected to server!");
    };
  
    ws.onmessage = (msg) => {
      console.log("Server says:", msg.data);
      addMessage("Server says: " + msg.data);
    };
  
    ws.onclose = () => {
      console.log("Disconnected from server");
      addMessage("Disconnected from server");
    };
  }
  
  function addMessage(text) {
    const div = document.getElementById("messages");
    const p = document.createElement("p");
    p.textContent = text;
    div.appendChild(p);
  }
  