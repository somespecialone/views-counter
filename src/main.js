const app = require("express")();

!process.env.DETA_SPACE_APP && require("dotenv").config(); // dev mode

const { allowCors, cacheControl } = require("./middlewares/main.middleware");
const mainRouter = require("./routes/main.route");

app.use(allowCors);
app.use(cacheControl);
app.use("/", mainRouter);

module.exports = app
