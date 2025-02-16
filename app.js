const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const { CORS_ORIGIN, TOKEN } = process.env;

const app = express();

app.use(helmet());

app.use(morgan("dev"));

app.use(cors({
    origin: CORS_ORIGIN
}));

app.use(express.json());

app.post("/login", (req, res, next) => {
    // verificação de usuário e senha, implementar JWT
    res.json({ token: TOKEN });
});

module.exports = app;