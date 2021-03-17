const fs = require("fs");

module.exports = async (file, newPath) => {
    return new Promise((resolve, reject) => {
        try {
            file.mv(newPath, resolve())
        } catch (e) {
            reject(e);
        }
    })
}
