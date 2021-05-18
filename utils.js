const yargs = require("yargs")
const config = require('./config.json')

let invalidConfig = false
if (config.sleep_time === undefined) {
    console.error("config: missing sleep_time")
    invalidConfig = true
}
if (config.notification_delay === undefined) {
    console.error("config: missing notification_delay")
    invalidConfig = true
}
if (config.email === undefined) {
    console.error("config: missing email settings")
    invalidConfig = true
} else {
    if (config.email.from === undefined || config.email.from === "") {
        console.error("config: invalid email.from")
        invalidConfig = true
    }
    if (config.email.to === undefined) {
        console.error("config: missing email.to")
        invalidConfig = true
    }
    if (typeof config.email.to === "string") {
        console.error("config: invalid email.to (must be an array of addresses)")
        invalidConfig = true
    }
    if (config.email.nodemailer_settings === undefined) {
        console.error("config: missing email.nodemailer_settings")
        invalidConfig = true
    }
}

if (invalidConfig) {
    process.exit(1)
}

// Capture command-line arguments
const argv = yargs
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging'
    })
    .option('visual', {
        alias: 'vis',
        type: 'boolean',
        description: 'Show the script running in Chromium'
    })
    .option('debug', {
        type: 'boolean',
        description: 'Run interactive debugging'
    })
    .argv

class Utils {
    constructor() {
        this.waiting = argv.debug
    }

    sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        })
    }

    isVerboseLoggingEnabled() {
        return argv.verbose
    }

    isVisualBrowserEnabled() {
        return argv.visual || argv.debug
    }

    isDebuggingEnabled() {
        return argv.debug
    }

    isCaptchaSolvingEnabled() {
        return config["2captcha"] &&
            config["2captcha"]["api_token"] &&
            config["2captcha"]["api_token"] !== ""
    }

    isDebugWaiting() {
        return this.waiting
    }

    setDebugWaiting(val) {
        this.waiting = val
    }
}

module.exports = new Utils()