const express = require("express");

const mainRouter = require("./routes/main.route");
const { allowCors, cacheControl } = require("./middlewares/main.middleware");

const app = express();

app.use(allowCors);
app.use(cacheControl);

app.use("/", mainRouter);

module.exports = app;
