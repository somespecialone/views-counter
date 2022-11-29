const { Deta } = require("deta");

const deta = Deta(process.env.DETA_PROJECT_KEY);
const db = deta.Base(process.env.DETA_BASE_NAME || "views-counter");

module.exports = { deta, db };
