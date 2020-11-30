const logger = require('./logger.js')
const mailer = require('./mailer.js')
const config = require('./config.json')
const scraper = require('./scraper.js')

/**
 * Send an email after finding an available item
 * @param {Object} item The item object that was found to be available
 */
function sendEmail(item) {
    logger.printfv("send email for newly available parts found: %s", item.name)

    // Build an html email
    const html = `<p>Dear bitch boy,</p><p>There are new items that recently became available:</p>
    <ul><li>${item.name} at ${item.url}</li></ul>
    <br>
    <hr>
    <p style="font-size: 10px;">The internet was searched for parts ${Math.floor((Date.now() - item.time) / 1000)} seconds ago, and now you are receiving this email.</p>`

    // Build the text backup content
    const text = `${item.name} at ${item.url}`

    // Send the email
    mailer.sendMail("Newly available parts", html, text)
        .catch(err => logger.printf("error while sending mail: %s", err))
}

logger.printf("begin scraping items every %d seconds", config.sleep_time)
scraper.go(config.sleep_time * 1000, sendEmail)
