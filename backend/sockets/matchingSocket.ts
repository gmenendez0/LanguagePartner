const WebSocket = require('ws');
import ws from 'ws';
const server = new WebSocket.Server({ port: 3002 });

export function broadcastMessage(user1: number, user2: number) {
  clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client.user === user1 || client.user === user2) {
        client.send('New match!');
      }
  });
}

let clients = [];

server.on('connection', ws => {
  ws.on('message', message => {
    (ws as any).user = Number(message);
  });
  clients.push(ws);

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
  });
});