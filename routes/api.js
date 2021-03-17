const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const fs = require("fs");
const moveFile = require("../helpers/moveFile");
const log = require("../helpers/logger");
const path = require("path");
const util = require("util");
const glob = require("glob");
const readFile = util.promisify(glob);
const uploads = `${__dirname}/../${process.env.UPLOADS}/`;
const domain = process.env.DOMAIN.endsWith("/") ? process.env.DOMAIN : process.env.DOMAIN + "/";

router.use((req, res, next) => {
    if (!req.headers.key || req.headers.key != process.env.KEY) 
        return res.status(403).json({ success: false, message: "Go away" });
    next();
})

router.post("/upload", async (req, res) => {
    if (!req.files) 
        return res.status(400).json({ success: false, message: "Upload an image." });
    const file = req.files.file;
    const name = nanoid(5);
    const ext = path.extname(file.name);
    const uploadPath = path.resolve(uploads + name + ext);
    try {
        await moveFile(file, uploadPath);
        log.success(`File ${name + ext} uploaded.`)
        res.json({
            success: true,
            url:  domain + name
        })
    } catch(e) {
        log.error(e);
        res.json({
            success: false,
            message: "An error occured while uploading the imgae."
        })
        return;
    }
})

router.post("/delete/:file", async (req, res) => { 
    const file = req.params.file;
    if (!file)
        return res.status(404).json({
            success: false,
            message: "No file to delete",
        })
    try {
        const fileLocal = await readFile(path.resolve(uploads + `${file}.*`));
        fs.unlinkSync(fileLocal[0])
        log.success(`${file} deleted.`)
        return res.send({
            success: true,
            message: `Successfully deleted ${file}`
        })
    } catch (e) {
        log.error(e)
        return res.status(404).json({
            success: false,
            message: "No file to delete",
        })
    }
})

module.exports = router;