require("dotenv").config({ path: `${__dirname}/../.env` });
const express = require("express");
const fs = require("fs");
const path = require("path");
const log = require("@iaverage/logger");
const { notFound } = require("./helpers/requestHandler");
const middleware = require("./middleware/index");
const rateLimits = require("./middleware/rateLimits");
const app = express();

// Route imports
const main = require("./routes/view");
const api = require("./routes/api");

const port = process.env.PORT || 3000;

// Make sure all required envs are set
[process.env.KEY, process.env.DOMAIN].forEach((env) => {
    if (!env) {
        log.error("Missing required env variables, make sure KEY and DOMAIN are set in .env");
        process.exit(1);
    }
});

// Set default env values it not set.
if (!process.env.UPLOADS) process.env.UPLOADS = "uploads";

// Create uploads directory
try {
    const uploadsDir = path.resolve(`${__dirname}/../${process.env.UPLOADS}/`);
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
        log.info("Created uploads dir");
    }
} catch (e) {
    log.error(e);
    log.error("An error occured while creating uploads directroy");
    process.exit(1);
}

// Trust reverse proxy
app.set("trust proxy", "loopback");

// Apply middlewares
app.use(middleware);

// Routes
app.use("/", rateLimits.requestLimiter, main);
app.use("/api", rateLimits.apiLimiter, api);

// 404
app.use((_, res) => {
    if (process.env.REDIRECT_URL) {
        res.redirect(process.env.REDIRECT_URL);
    } else {
        notFound(res, "Not Found");
    }
});

app.listen(port, "0.0.0.0", () => log.info(`Server started, listening on port ${port}`));
