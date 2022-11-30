const express = require("express");

const { getBadgeCounter, getJsonCounter, notFound } = require("../controllers/main.controller");

const router = express.Router();

router.get("/favicon.ico", notFound); // catch browser icon request
router.get("/:key/badge", getBadgeCounter);
router.get("/:key", getJsonCounter);

module.exports = router;
