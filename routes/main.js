const express = require("express");
const router = express.Router();
const glob = require("glob");
const fs = require("fs");
const log = require("../helpers/logger");
const util = require("util");
const mkdirAsync = util.promisify(fs.mkdir);
const readFile = util.promisify(glob);
const uploads = `${__dirname}/../${process.env.UPLOADS}/`;
const path = require("path");

router.get("/:file", async (req, res) => {
    try { 
        const file = req.params.file.split(".")[0];
        if (!file)
            return res.redirect(`${process.env.REDIRECT_URL}`);
        // Check uploads exists
        try {
            await fs.promises.access(uploads);
        } catch (e) {
            log.warn(`${process.env.UPLOADS} didn't exist, creating..`)
            await mkdirAsync(uploads);
        }
        // Check if file exists
        try {
            const fileLocal = await readFile(path.resolve(uploads + `${file}.*`));
            if (fileLocal.length > 0)
                res.sendFile(fileLocal[0]);
            else 
                res.redirect(`${process.env.REDIRECT_URL}`);
            return;
        } catch (e) {
            log.error(e);
        }
    } catch(e) {
        log.error(e);
    }
    res.json({ success: false, message: "An error occured." })
})

module.exports = router;