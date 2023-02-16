const express = require("express");

const app = express();

!process.env.DETA_SPACE_APP && require("dotenv").config(); // dev mode

const { allowCors, cacheControl } = require("./middlewares/main.middleware");
const mainRouter = require("./routes/main.route");

app.use(allowCors);
app.use(cacheControl);
app.use("/", mainRouter);

const port = parseInt(process.env.PORT) || 3000;
app.listen(port);

module.exports = app
