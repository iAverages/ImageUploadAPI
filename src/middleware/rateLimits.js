const rateLimit = require("express-rate-limit");
const mongoStore = require("rate-limit-mongo");

const rateLimitStore = new mongoStore({
    uri: process.env.MONGO_URI,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
});

const apiLimiter = rateLimit({
    windowMs: 1000 * 60,
    max: 10,
    message: "Stop requesting my shit.",
    store: rateLimitStore,
});

const requestLimiter = rateLimit({
    windowMs: 1000 * 60 * 10,
    max: 20,
    message: "Stop requesting my shit.",
    store: rateLimitStore,
});

module.exports = {
    requestLimiter,
    apiLimiter,
};
