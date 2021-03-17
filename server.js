const express = require("express");
const fileupload = require("express-fileupload")
const helmet = require("helmet");
const cors = require("cors");
const morgan = require('morgan');
const log = require("./helpers/logger");
const app = express();
require("dotenv").config()

const port = process.env.PORT || 3000;
const main = require("./routes/main");
const api = require("./routes/api");
const middleware = [
    fileupload({
        preserveExtension: true,
        safeFileNames: true,
        limits: {
            fileSize: process.env.MAX_UPLOAD || 52428800
        }
    }),
    helmet(),
    express.json(),
    cors(),
    morgan("combined"),
]

app.use(middleware);
app.use("/", main);
app.use("/api", api);

app.listen(port, () => log.info(`Server started, listening on port ${port}`));