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
    .argv

class Utils {
    sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        })
    }

    isVerboseLoggingEnabled() {
        return argv.verbose
    }

    isVisualBrowserEnabled() {
        return argv.visual
    }

    isCaptchaSolvingEnabled() {
        return config["2captcha"] &&
            config["2captcha"]["api_token"] &&
            config["2captcha"]["api_token"] !== ""
    }
}

module.exports = new Utils()