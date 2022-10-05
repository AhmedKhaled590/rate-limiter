const { checkIfIPV6, getIp } = require("./ipUtils");
const configureCache = require("./configureCache");

const TIME_LIMIT = 60; // 1 Minute
const MAX_REQUESTS_PER_SECOND = 5;
const MAX_REQUESTS_PER_FRAME = 100;

const rateLimit = (
  options = {
    timeLimit: TIME_LIMIT,
    maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    maxRequestsPerFrame: MAX_REQUESTS_PER_FRAME,
    statusCode: 429,
    message: "Too many requests",
    responseHeaders: true,
  }
) => {
  const cache = configureCache(options.timeLimit);

  return async (req, res, next) => {
    if (
      options.timeLimit === 0 ||
      options.maxRequestsPerSecond === 0 ||
      options.maxRequestsPerFrame === 0
    ) {
      return next();
    }
    // Get the IP address of the request
    let ip = getIp(req);

    // Check if the IP address is valid
    if (checkIfIPV6(ip)) {
      ip = ip.split(":").splice(0, 4).join(":") + "::/64";
    }

    // Create a new cache for the IP address
    updateCache(cache, ip, options.timeLimit);

    // Get the cache for the IP address
    const ipCache = cache.get(ip);

    if (ipCache.length > options.maxRequestsPerFrame) {
      options.responseHeaders &&
        res.header({
          "X-RateLimit-Limit": options.maxRequestsPerSecond,
          "X-RateLimit-Remaining": 0,
          "X-RateLimit-Reset": Math.ceil(
            (options.timeLimit * 1000 -
              (ipCache[ipCache.length - 1] - ipCache[0])) /
              1000
          ),
        });
      return res.status(options.statusCode).send(options.message);
    }
    // Check if the IP address has exceeded the limit
    if (ipCache.length > 3) {
      const timeDiff = ipCache[ipCache.length - 1] - ipCache[0];
      const rps = ipCache.length / (timeDiff / 1000);
      console.log(`IP: ${ip} RPS: ${rps}`);
      if (rps > options.maxRequestsPerSecond) {
        options.responseHeaders &&
          res.header({
            "X-RateLimit-Limit": options.maxRequestsPerSecond,
            "X-RateLimit-Remaining": 0,
            "X-RateLimit-Reset": Math.ceil(
              (options.timeLimit * 1000 -
                (ipCache[ipCache.length - 1] - ipCache[0])) /
                1000
            ),
          });
        return res.status(options.statusCode).send(options.message);
      }
    }
    options.responseHeaders &&
      res.header({
        "X-RateLimit-Limit": options.maxRequestsPerSecond,
        "X-RateLimit-Remaining": options.maxRequestsPerSecond - ipCache.length,
        "X-RateLimit-Reset": Math.ceil(
          (options.timeLimit * 1000 -
            (ipCache[ipCache.length - 1] - ipCache[0])) /
            1000
        ),
      });
    next();
  };
};

const updateCache = (cache, ip, timeLimit) => {
  let ipCache = cache.get(ip) || [];
  ipCache.push(Date.now());
  cache.set(ip, ipCache, timeLimit - Date.now());
};

module.exports = rateLimit;
