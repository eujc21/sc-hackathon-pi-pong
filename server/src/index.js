const WebSocketServer = require('ws').Server;
const clientServer = new WebSocketServer({ port: 8080 });
const paddleServer = new WebSocketServer({ port: 3000 });

paddleServer.on('connection', (ws) => {
  ws.on('message', (data) => {
    // Broadcast to everyone else.
    clientServer.clients.forEach((client) => {
      client.send(data);
    });
  });
});
