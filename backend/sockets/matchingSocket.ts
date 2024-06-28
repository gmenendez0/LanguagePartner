const WebSocket = require('ws');
import ws from 'ws';
const server = new WebSocket.Server({ port: 3002 });

export function broadcastMessage(user1: number, user2: number, name1: string, name2: string) {
  clients.forEach(client => {
      if (client.user === user1 && client.readyState === WebSocket.OPEN) {
        client.send(name2.toString())
      }
      if (client.user === user2 && client.readyState === WebSocket.OPEN) {
        client.send(name1.toString())
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