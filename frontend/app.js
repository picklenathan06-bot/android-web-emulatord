function connect() {
    const ws = new WebSocket("ws://localhost:8080");
  
    ws.onopen = () => {
      console.log("Connected");
      ws.send("Hello server");
    };
  
    ws.onmessage = (msg) => {
      console.log("Server:", msg.data);
    };
  }
  