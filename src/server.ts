const express = require("express");
const fileupload = require("express-fileupload");
const helmet = require("helmet");
const cors = require("cors");
const log = require("helpers/logger.js");
const app = express();
require("dotenv").config()

const port = process.env.PORT || 3000;
const main = require("./routes/main");
const upload = require("./routes/upload");
const middleware = [
    fileupload(),
    helmet(),
    express.json().
    cors(),
]

app.use(middleware);
app.use("/", main);
app.listen(port, () => log.info(`Server started, listening on port ${port}`));