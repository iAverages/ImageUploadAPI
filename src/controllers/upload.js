const { nanoid } = require("nanoid");
const fs = require("fs");
const util = require("util");
const mkdirAsync = util.promisify(fs.mkdir);
const moveFile = require("../helpers/moveFile");
const log = require("@iaverage/logger");
const path = require("path");
const { badRequest, error, success } = require("../helpers/requestHandler");
const uploads = `${__dirname}/../../${process.env.UPLOADS}/`;
const domain = process.env.DOMAIN?.endsWith("/") ? process.env.DOMAIN : process.env.DOMAIN + "/";
const removeExt = new Set(["png", "jpeg", "jpg", "gif", "webp"]);
const catchError = require("../helpers/catchError");

module.exports = catchError(async (req, res) => {
    if (!req.files || !req.files.file) return badRequest(res, "Upload an image.");
    const file = req.files.file;
    const name = nanoid(5);
    const ext = path.extname(file.name);
    const uploadPath = path.resolve(uploads + name + ext);

    // Check uploads exists
    try {
        await fs.promises.access(uploads);
    } catch (e) {
        log.warn(`${process.env.UPLOADS} didn't exist, creating..`);
        await mkdirAsync(uploads);
    }

    try {
        await moveFile(file, uploadPath);
        log.success(`File ${name + ext} uploaded.`);
        success(res, "Image uploaded successfully", {
            url: domain + name + (removeExt.has(ext.substring(1)) ? "" : ext),
        });
    } catch (e) {
        log.error(e);
        error(res, "An error occured while uploading the imgae.");
        return;
    }
});
