require("dotenv").config();
const WebSocket = require("ws");

const { PORT } = process.env;

const wss = new WebSocket.Server({
    port: PORT
});

function broadcast(jsonObject, room) {
    if (!this.clients) return;
    this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.room === room) {
            client.send(JSON.stringify(jsonObject));
        }
    });
}

function onMessage(ws, data) {
    try {
        const message = JSON.parse(data.toString());
        console.log("Received:", message);

        if (message.type === "joinRoom") {
            ws.room = message.room;
            ws.send(JSON.stringify({ type: "status", message: `Joined room ${message.room}` }));
        } else {
            ws.send(JSON.stringify({ type: "status", message: "Message received" }));
        }
    } catch (error) {
        console.error("Error parsing message:", error);
        ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
    }
}

function onError(ws, error) {
    console.error("Error:", error);
    ws.send(JSON.stringify({ type: "error", message: "An error occurred" }));
}

function onConnection(ws, req) {
    console.log("New connection");
    ws.on("message", data => onMessage(ws, data));
    ws.on("error", error => onError(ws, error));
    ws.on("close", () => console.log("Client disconnected"));
}

wss.on("connection", onConnection);
wss.broadcast = broadcast;

setInterval(() => {
    wss.broadcast({ type: "time", time: new Date() }, "defaultRoom");
}, 5000);

console.log(`WebSocket Server is running at ${PORT}`);