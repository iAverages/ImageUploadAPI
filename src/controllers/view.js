const glob = require("glob");
const path = require("path");
const fs = require("fs");
const log = require("@iaverage/logger");
const util = require("util");
const mkdirAsync = util.promisify(fs.mkdir);
const readFile = util.promisify(glob);
const uploads = path.resolve(`${__dirname}/../../${process.env.UPLOADS}/`);
const { error } = require("../helpers/requestHandler");
const catchError = require("../helpers/catchError");

module.exports = catchError(async (req, res, next) => {
    try {
        // Get requested file name.
        const file = req.params.file.split(".")[0];
        if (!file) return next();

        // Check uploads exists
        try {
            await fs.promises.access(uploads);
        } catch (e) {
            log.warn(`${process.env.UPLOADS} didn't exist, creating..`);
            await mkdirAsync(uploads);
        }

        // Check if file exists
        try {
            const fileLocal = await readFile(path.resolve(uploads + `/${file}.*`));
            console.log(path.resolve(uploads + `${file}.*`));
            fileLocal.length > 0 ? res.sendFile(fileLocal[0]) : next();
            return;
        } catch (e) {
            log.error(e);
        }
    } catch (e) {
        log.error(e);
    }
    error(res, "An error occured.");
});
