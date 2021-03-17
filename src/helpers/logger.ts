const colors = require("colors");
const axios = require("axios");

/**
 * Prefix message with timestamp
 * @param {String} message 
 */
const logger = (message: string) => { 
    const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    console.log(`${colors.gray(`[${date}]`)} ${message}`)
}

/**
 * Log a debug message. Prefixed with a pink [UWU]
 * @param {String} message 
 */
const uwu = (message: string) => { logger(`${colors.brightMagenta('[UWU]')} ${message}`); }

/**
 * Log a info message. Prefixed with a cyan [INFO]
 * @param {String} message 
 */
const info = (message: string) => { logger(`${colors.cyan('[INFO]')} ${message}`); }

/**
 * Log a success message. Prefixed with a green [SUCCESS]
 * @param {String} message 
 */
const success = (message: string) => { logger(`${colors.green('[SUCCESS]')} ${message}`); }

/**
 * Log a warn message. Prefixed with a yellow [WARN]
 * @param {String} message 
 */
const warn = (message: string) => { logger(`${colors.yellow('[WARN]')} ${message}`); }

/**
 * Log an error message. Prefixed with [ERROR], whole message is in red.
 * @param {String} message 
 */
const error = (message: string, ping = true) => { 
    logger(colors.red(`[ERROR]`, message));
    if(ping && process.env.DISC_ERROR_WEBHOOK) {
        try{ 
            axios.post(process.env.ERROR_WEBHOOK, {content: `<@307952129958477824> ${message}`}); 
        } catch (err) {
            logger(`${colors.red('[ERROR]')} ${message}`);
        }
    }
};

module.exports.uwu = uwu;
module.exports.info = info;
module.exports.error = error;
module.exports.success = success;
module.exports.warn = warn;