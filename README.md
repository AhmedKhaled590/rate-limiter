# API Rate Limiter

### Simple rate-limiter NPM Module used for blocking IPs that exceeds certain number of requests per second in a specific time frame.

## Installation

```
    npm i @ahmedkhaled1444/rate-limiter
```

## How it works

```js
    const rateLimiter = require("@ahmedkhaled1444/rate-limiter");
    app.use(
    rateLimiter({
        timeLimit: 10, // Time frame in seconds to check for requests
        maxRequestsPerSecond: 1, // Maximum number of requests per second
    });
    );
```
