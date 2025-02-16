require("dotenv").config();

const { PORT } = process.env;

const app = require("./app");

const server = app.listen(PORT, () => {
    console.log(`Web Server is running at port ${PORT}`);
});
