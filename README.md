# API Rate Limiter

### Zero-Dependencies Simple rate-limiter NPM Module used for blocking IPs that exceeds certain number of requests per second in a specific time frame.

### https://www.npmjs.com/package/@ahmedkhaled1444/rate-limiter

## Installation

```
    npm i @ahmedkhaled1444/rate-limiter
```

## How it works

```js
const rateLimiter = require("@ahmedkhaled1444/rate-limiter");
app.use(
  rateLimit({
    timeLimit: 60,
    maxRequestsPerSecond: 70,
    maxRequestsPerFrame: 1000,
    statusCode: 429,
    message: "Too many requests, please try again later",
    responseHeaders: true,
  })
);
```

## Options

### timeLimit

- Type: `Number`
- Default: `60`
- Description: The time frame in seconds to check the number of requests.
- Set to `0` to disable the rate limiter.

### maxRequestsPerSecond

- Type: `Number`
- Default: `5`
- Description: The maximum number of requests per second.
- Set to `0` to disable the rate limiter.

### maxRequestsPerFrame

- Type: `Number`
- Default: `100`
- Description: The maximum number of requests per time frame.
- Set to `0` to disable the rate limiter.

### statusCode

- Type: `Number`
- Default: `429`
- Description: The status code to send when the request is blocked.

### message

- Type: `String`
- Default: `Too many requests.`
- Description: The message to send when the request is blocked.

### responseHeaders

- Type: `Boolean`
- Default: `true`
- Description: If set to true, the response will contain the following headers:
  - `X-RateLimit-Limit`: The maximum number of requests per time frame.
  - `X-RateLimit-Remaining`: The remaining number of requests per time frame.
  - `X-RateLimit-Reset`: The time frame in seconds.
- If set to false, the response will not contain any of the above headers.
