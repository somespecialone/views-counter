const app = require("./src/app");

module.exports = app;

// dev mode
if (!process.env.DETA_RUNTIME) {
  app.listen(3000, () => console.info("Listen on http://localhost:3000"));
}
