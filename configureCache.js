const IPcache = require("node-cache");

const configureCache = (timeLimit) => {
  const cache = new IPcache({
    stdTTL: timeLimit,
    checkperiod: timeLimit,
    deleteOnExpire: false,
  });

  cache.on("expired", (key, value) => {
    if (new Date() - value[value.length - 1] > timeLimit * 1000) {
      cache.del(key);
    } else {
      const updateValue = value.filter((time) => {
        return new Date() - time < timeLimit * 1000;
      });
      cache.set(
        key,
        updateValue,
        timeLimit - (Date.now() - updateValue[0] / 1000)
      );
    }
  });
  return cache;
};

module.exports = configureCache;
