const express = require("express");
const fileupload = require("express-fileupload");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoStore = require("rate-limit-mongo");
const log = require("./helpers/logger");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3000;
const main = require("./routes/main");
const api = require("./routes/api");
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

const middleware = [
    fileupload({
        preserveExtension: true,
        safeFileNames: true,
        limits: {
            fileSize: process.env.MAX_UPLOAD || 52428800,
        },
    }),
    helmet(),
    express.json(),
    cors({
        origin: process.env.DOMAIN.replace(/^https?:\/\//g, ""),
    }),
    morgan("combined"),
];

app.set("trust proxy", "loopback");
app.use(middleware);
app.use("/", requestLimiter, main);
app.use("/api", apiLimiter, api);
app.use((req, res) => {
    if (process.env.REDIRECT_URL) res.redirect(process.env.REDIRECT_URL);
    else
        res.status(404).json({
            success: false,
            message: "Not found",
        });
});

app.listen(port, "0.0.0.0", () => log.info(`Server started, listening on port ${port}`));
