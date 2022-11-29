const { makeBadge } = require("badge-maker");
const { db } = require("../config/db.config");

const views = {}; // views counters mapping

const prepareViews = async (key, noIncrement) => {
  if (!views[key]) {
    const item = (await db.get(key)) || { views: 0 };
    views[key] = item.views;
    if (!views[key] && !noIncrement) {
      // init data if there is not
      await db.put({ views: 0 }, key);
    }
  }
  // increment
  if (!noIncrement) {
    await db.update({ views: db.util.increment(1) }, key);
    views[key]++;
  }

  return views[key];
};

const notFound = (req, res) => res.sendStatus(404);

const getBadgeCounter = async (req, res) => {
  const { label, labelColor, color, style, noIncrement } = req.query;

  const { key } = req.params;
  const counter = await prepareViews(key, noIncrement);

  let badge;
  let status;
  try {
    badge = makeBadge({
      label: label || "views",
      message: counter.toString(),
      color: color || "blue",
      labelColor: labelColor || "",
      style: style || "flat",
    });
    status = 200;
  } catch (e) {
    badge = makeBadge({
      label: "error",
      color: "red",
      message: "invalid badge param/s",
    });
    status = 400;
  }

  res.append("content-type", "image/svg+xml; charset=utf-8");
  res.append("cache-control", "max-age=0, no-cache, no-store, must-revalidate");
  res.status(status).send(badge);
};

const getJsonCounter = async (req, res) => {
  const { noIncrement } = req.query;

  const { key } = req.params;
  const counter = await prepareViews(key, noIncrement);

  res.status(200).json({ counter });
};

module.exports = { notFound, getBadgeCounter, getJsonCounter };
