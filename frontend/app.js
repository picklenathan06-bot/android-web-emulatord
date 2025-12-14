function connect() {
    const ws = new WebSocket("wss://android-web-emulator-zdx5.onrender.com");
  
    ws.onopen = () => {
      console.log("Connected to server!");
      ws.send("Hello from frontend");
    };
  
    ws.onmessage = (msg) => {
      console.log("Server says:", msg.data);
    };
  
    ws.onclose = () => {
      console.log("Disconnected from server");
    };
  }
  