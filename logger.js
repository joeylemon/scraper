const { timeStamp } = require("console")
const moment = require("moment-timezone")
const util = require("util")
const utils = require("./utils.js")

function colorize(text) {
    return text
        .replace(/{N}/g, "\033[0m")     // No color
        .replace(/{RD}/g, "\033[0;31m") // Red
        .replace(/{GN}/g, "\033[0;32m") // Green
        .replace(/{YL}/g, "\033[1;33m") // Yellow
}

class Logger {
    /**
     * Print a message
     * @param {String} message The message to print
     */
    print(message) {
        const time = moment().tz("America/New_York").format("M/D/YY h:mm:ssa")

        let split = (new Error().stack).split("at ")[3]
        const path = split.trim().replace(/\(|\)|file:\/\/\//g, "").split("/")

        const file = path[path.length - 1].split(":")
        const line = `${file[0]}:${file[1]}`
    
        console.log(`[${time}] [${line}] ${colorize(message)}`)
    }

    /**
     * Print a formatted message
     * @param {String} format String format
     * @param  {...any} args Format arguments
     */
    printf(format, ...args) {
        this.print(util.format(colorize(format), ...args))
    }

    /**
     * Print a message only if verbose logging is enabled
     * @param {String} message The message to print
     */
    printv(message) {
        if (utils.isVerboseLoggingEnabled())
            this.print(message)
    }

    /**
     * Print a formatted message only if verbose logging is enabled
     * @param {String} format String format
     * @param  {...any} args Format arguments
     */
    printfv(format, ...args) {
        if (utils.isVerboseLoggingEnabled())
            this.printf(format, ...args)
    }
}

module.exports = new Logger()