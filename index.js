require("dotenv").config();

const { PORT } = process.env;

const app = require("./app");
const wss = require("./websocketserver");

const server = app.listen(PORT, () => {
    console.log(`HTTP Server is running at port ${PORT}`);
});

wss(server);