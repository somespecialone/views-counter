const express = require("express");

const mainRouter = require("./routes/main.route");

const app = express();

app.use("/", mainRouter);

module.exports = app;
