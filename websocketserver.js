const WebSocket = require("ws");

const { CORS_ORIGIN, TOKEN } = process.env;

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

function verifyClient(info, callback) {
    // Verifica se o token é válido
    const isTokenValid = info.req.headers.token === TOKEN;
    // Verifica se a origem da requisição é permitida
    const isSameOriginCORS = info.req.headers.origin === CORS_ORIGIN;
    // Define se há uma restrição de origem (evita '*' que aceita tudo)
    const isCorsRestricted = CORS_ORIGIN !== "*";

    // Só autoriza se o token for válido e, se houver CORS, a origem for correta
    const userAuthorized = isTokenValid && (!isCorsRestricted || isSameOriginCORS);
    callback(userAuthorized);
}

module.exports = (server) => {
    const wss = new WebSocket.Server({
        server,
        verifyClient
    });

    wss.on("connection", onConnection);
    wss.broadcast = broadcast;

    setInterval(() => {
        wss.broadcast({ time: new Date() });
    }, 5000);

    console.log(`WebSocket Server is running at ${server.toString()}`);

    return wss;
};