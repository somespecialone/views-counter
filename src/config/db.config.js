const { Deta } = require("deta");

!process.env.DETA_RUNTIME && require("dotenv").config();

const deta = Deta(process.env.DETA_PROJECT_KEY);
const db = deta.Base(process.env.DETA_BASE_NAME || "views-counter");

module.exports = { deta, db };
