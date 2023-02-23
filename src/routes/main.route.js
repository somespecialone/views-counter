const express = require("express");

const { getBadgeCounter, getJsonCounter } = require("../controllers/main.controller");

const router = express.Router();

router.get("/:key/badge", getBadgeCounter);
router.get("/:key", getJsonCounter);

module.exports = router;
