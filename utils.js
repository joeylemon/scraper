const yargs = require("yargs")
const config = require('./config.json')

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