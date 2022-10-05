import IPcache from "node-cache";

const TIME_LIMIT = 10;
const MAX_REQUESTS_PER_SECOND = 100;

export const rateLimit = (
  options = {
    timeLimit: TIME_LIMIT,
    maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
  }
) => {
  const cache = new IPcache({
    stdTTL: options.timeLimit,
    checkperiod: options.timeLimit,
    deleteOnExpire: false,
  });

  cache.on("expired", (key, value) => {
    if (new Date() - value[value.length - 1] > options.timeLimit * 1000) {
      cache.del(key);
    } else {
      const updateValue = value.filter((time) => {
        return new Date() - time < options.timeLimit * 1000;
      });
      cache.set(
        key,
        updateValue,
        options.timeLimit - (Date.now() - updateValue[0] / 1000)
      );
    }
  });

  return async (req, res, next) => {
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
    console.log(`IP: ${ip} - Requests: ${ipCache.length}`);
    // Check if the IP address has exceeded the limit
    if (ipCache.length > 1) {
      const timeDiff = ipCache[ipCache.length - 1] - ipCache[0];
      const rps = ipCache.length / (timeDiff / 1000);
      console.log(`IP: ${ip} RPS: ${rps}`);
      if (rps > options.maxRequestsPerSecond) {
        return res.status(429).send("Too many requests");
      }
    }
    next();
  };
};

const updateCache = (cache, ip, timeLimit) => {
  let ipCache = cache.get(ip) || [];
  ipCache.push(Date.now());
  cache.set(ip, ipCache, timeLimit - Date.now());
};

const getIp = (req) => {
  const ip =
    req.headers["X-Client-IP"] ||
    req.headers["x-forwarded-for"] ||
    req.headers["CF-Connecting-IP"] ||
    req.headers["Fastly-Client-IP"] ||
    req.headers["True-Client-IP"] ||
    req.headers["X-Real-IP"] ||
    req.headers["X-Cluster-Client-IP"] ||
    req.headers["X-Forwarded"] ||
    req.headers["appengine-user-ip"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress ||
    req.info.remoteAddress ||
    req.headers["CF-Pseudo-IPv4"] ||
    req.headers["request.raw"] ||
    req.ip;

  return ip;
};

const checkIfIPV6 = (ip) => {
  return ip.includes(":");
};
