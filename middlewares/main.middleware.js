const cacheControl = function (req, res, next) {
  res.append("cache-control", "max-age=0, no-cache, no-store, must-revalidate");
  next();
};

const allowCors = function (req, res, next) {
  res.append("access-control-allow-origin", "*");
  res.append("access-control-allow-headers", "*");
  next();
};

module.exports = { allowCors, cacheControl };
