const WebSocket = require("ws");

const { PORT } = process.env;

const wss = new WebSocket.Server({ port: PORT });

function broadcast(jsonObject) {
    if (!this.clients) return;
    this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(jsonObject));
        };
    });
};

function onMessage(ws, data) {
    console.log(data.toString());
    ws.send("received!");
};

function onError(ws, error) {
    console.log(error);
    ws.send("ERROR!");
};

function onConnection(ws, req) {
    console.log("on connection");
    ws.on("message", data => onMessage(ws, data));
    ws.on("error", error => onError(ws, error));
};

wss.on("connection", onConnection);

wss.broadcast = broadcast;

setInterval(() => {
    wss.broadcast({ time: new Date() });
}, 5000);

console.log(`WebSocket Server is running at ${PORT}`);