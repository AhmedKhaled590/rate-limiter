class cache {
  constructor(timeLimit) {
    this.cache = new Map();
    this.timeLimit = timeLimit;
  }

  getValues(key) {
    return this.cache.has(key) ? this.cache.get(key) : [];
  }

  set(key) {
    this.cache.set(key, this.timeLimit);
  }

  update(key, value) {
    let values = this.getValues(key);
    values.push(value);
    this.cache.set(key, values);
  }

  delete(key) {
    this.cache.delete(key);
  }

  onTimeout() {
    const now = Date.now();
    for (const [key, value] of this.cache) {
      if (now - value[value.length - 1] > this.timeLimit * 1000) {
        this.delete(key);
      } else {
        const updateValue = value.filter(
          (time) => now - time < this.timeLimit * 1000
        );
        this.cache.set(key, updateValue);
      }
    }
  }
}

const configureCache = (timeLimit) => {
  const ipCache = new cache(timeLimit);
  setInterval(() => ipCache.onTimeout(), timeLimit);
  return ipCache;
};

module.exports = configureCache;
