const items = require('./items.js')
const createPage = require('./create.js')
const logger = require('./logger.js')
const utils = require('./utils.js')
const config = require('./config.json')

const proxyChain = require('proxy-chain')

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

// Configure puppeteer plugins, including 2captcha solving
puppeteer.use(StealthPlugin())
puppeteer.use(AdblockerPlugin())

if (utils.isCaptchaSolvingEnabled()) {
    puppeteer.use(
        RecaptchaPlugin({
            provider: {
                id: '2captcha',
                token: config["2captcha"]["api_token"],
            },
            visualFeedback: true,
        })
    )
}

class Scraper {
    /**
     * Begin the continuous process of scraping the websites for the list of items
     * @param {Number} sleepTime The time (ms) to wait between performing another scrape iteration
     * @param {Function} onFound The function to execute upon finding an available item
     */
    async go(sleepTime, onFound) {
        try {
            // Launch browser with options to help reduce CPU usage
            logger.printv("launch browser")
            const proxyUrl = await proxyChain.anonymizeProxy('http://zhlqmfxz-rotate:axnnhrifc9yd@p.webshare.io:80')
            this.browser = await puppeteer.launch({
                headless: !utils.isVisualBrowserEnabled(),
                userDataDir: "./browser_data",
                args: [
                    `--proxy-server=${proxyUrl}`,
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu'
                ]
            })

            // Scrape every item individually and sequentially
            for (const item of items) {
                const page = await createPage(this.browser)
                const available = await this.scrape(page, item)

                if (typeof available === "string") {
                    logger.printf("{RD}ERR{N} %s unavailable: %s\n", item.name, available)
                } else {
                    switch (available) {
                        case true:
                            logger.printf("{GN}✔{N} %s available!\n", item.name)
                            onFound(item)
                            break
                        case false:
                            logger.printf("{RD}✘{N} %s unavailable\n", item.name)
                            break
                        default:
                            logger.printf("{YL}???{N} %s unavailable\n", item.name)
                            break
                    }
                }

                if (utils.isDebuggingEnabled()) {
                    console.log("waiting for input to continue debugging ...")
                    while (utils.isDebugWaiting()) { await utils.sleep(50) }
                }

                item.time = Date.now()
                page.close()
            }

            this.browser.close()

            // Use recursion to repeat the process
            logger.printfv("repeat in %d seconds\n\n", sleepTime / 1000)
            await utils.sleep(sleepTime)
            this.go(sleepTime, onFound)
        } catch (err) {
            if (this.browser) this.browser.close()

            // Use recursion to repeat the process
            console.error("error while scraping all: ", err)
            await utils.sleep(sleepTime)
            this.go(sleepTime, onFound)
        }
    }

    /**
     * Scrape an item by navigating to its URL, solve any captchas, and perform its scrape function
     * @param {Object} page The page object, created with createPage()
     * @param {Object} item The item object containing the item's information and scrape functions
     */
    async scrape(page, item) {
        try {
            // Perform initial function before navigating to page
            if (item.init) await item.init(page, item)

            logger.printfv("go to %s", item.name)
            await page.goto(item.url, { waitUntil: item.waitUntil ? item.waitUntil : 'networkidle2' })

            // Check if we've been flagged for scraping
            const val = await page.evaluate(() => {
                const heading = document.querySelector("h1")
                if (heading && heading.innerText.toLowerCase().includes("access denied"))
                    return "access denied"

                return false
            })
            if (typeof val === "string") return val

            // Perform setup function before page evaluation
            if (item.setup) await item.setup(page, item)

            if (utils.isCaptchaSolvingEnabled()) {
                const preCaptcha = Date.now()
                await page.solveRecaptchas()

                // If there was a long pause, there was a captcha to solve
                if (Date.now() - preCaptcha > 3000) {
                    logger.printv("solved captcha, go to url")
                    await page.goto(item.url, { waitUntil: item.waitUntil ? item.waitUntil : 'networkidle2' })
                    await utils.sleep(6000)
                }
            }

            // Evaluate page to scrape data
            return await page.evaluate(item.func)
        } catch (err) {
            logger.printf("error while scraping %s: %s", item.name, err)
        }
    }
}

module.exports = new Scraper()