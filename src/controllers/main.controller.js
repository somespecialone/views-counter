const badgen = require("gradient-badge");

const { db } = require("../config/db.config");

const getViews = async (key, noIncrement) => {
  let data = await db.get(key);
  if (!data && !noIncrement) {
    data = { views: 1 };
    await db.put(data, key);
  } else if (!data) {
    data = { views: 0 };
  } else if (!noIncrement) {
    data.views++;
    await db.update({ views: db.util.increment() }, key);
  }

  return data.views;
};

const getBadgeCounter = async (req, res) => {
  const {
    label = "views",
    labelColor,
    color,
    style,
    gradient,
    icon,
    iconWidth,
    scale,
    noIncrement = false
  } = req.query;

  const { key } = req.params;
  const counter = await getViews(key, noIncrement);

  let badge;
  let status;
  try {
    badge = badgen({
      label,
      status: counter.toString(),
      color,
      labelColor,
      style,
      gradient: gradient ? gradient.split("-") : gradient,
      icon,
      iconWidth,
      scale
    });
    status = 200;
  } catch (e) {
    badge = badgen({
      label: "error",
      color: "red",
      status: "invalid badge param/s"
    });
    status = 400;
  }

  res.append("content-type", "image/svg+xml; charset=utf-8");
  res.status(status).send(badge);
};

const getJsonCounter = async (req, res) => {
  const { noIncrement = false } = req.query;

  const { key } = req.params;
  const counter = await getViews(key, noIncrement);

  res.status(200).json({ counter });
};

module.exports = { getBadgeCounter, getJsonCounter };
