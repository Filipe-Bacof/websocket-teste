const express = require("express");

const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.post("/login", (req, res, next) => {
    // verificação de usuário e senha, implementar JWT
    res.json({ token: "123456" });
});

module.exports = app;