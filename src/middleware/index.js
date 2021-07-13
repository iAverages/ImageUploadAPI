const express = require("express");
const fileupload = require("express-fileupload");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

module.exports = [
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
        origin: process.env.DOMAIN?.replace(/^https?:\/\//g, ""),
    }),
    morgan("combined"),
];
