const getIp = (req) => {
  const ip =
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress ||
    req.info.remoteAddress ||
    req.headers["appengine-user-ip"] ||
    req.headers["CF-Connecting-IP"] ||
    req.headers["CF-Pseudo-IPv4"] ||
    req.headers["request.raw"] ||
    req.headers["X-Client-IP"] ||
    req.headers["x-forwarded-for"] ||
    req.headers["Fastly-Client-IP"] ||
    req.headers["True-Client-IP"] ||
    req.headers["X-Real-IP"] ||
    req.headers["X-Cluster-Client-IP"] ||
    req.headers["X-Forwarded"];

  return ip;
};

const checkIfIPV6 = (ip) => {
  return ip.includes(":");
};

module.exports = {
  getIp,
  checkIfIPV6,
};
