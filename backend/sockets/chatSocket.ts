const WebSocket = require('ws');
import ws from 'ws';
const server = new WebSocket.Server({ port: 3001 });

interface MessageBroadcast {
  from: number;
  message: string;
  timestamp: Date;
  to: number;
}

export function broadcastMessage(message: MessageBroadcast) {
  clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client.user === message.to) {
          client.send(JSON.stringify(message));
      }
  });
}

let clients = []; // Map of user id to WebSocket connection

server.on('connection', ws => {
  ws.on('message', message => {
      (ws as any).user = Number(message);
  });
  clients.push(ws);

  ws.on('close', () => {
      clients = clients.filter(client => client !== ws);
  });
});
