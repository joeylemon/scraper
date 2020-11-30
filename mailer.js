const nodemailer = require("nodemailer")
const logger = require("./logger.js")
const config = require("./config.json")

// Check config values
if (!config.email) {
    logger.print("config: missing email settings")
    process.exit(1)
} else if (!config.email.from || config.email.from === "") {
    logger.print("config: invalid email.from")
    process.exit(1)
} else if (!config.email.to) {
    logger.print("config: missing email.to")
    process.exit(1)
} else if (typeof config.email.to === "string") {
    logger.print("config: invalid email.to (must be an array of addresses)")
    process.exit(1)
} else if (!config.email.nodemailer_settings) {
    logger.print("config: missing email.nodemailer_settings")
    process.exit(1)
}

const transporter = nodemailer.createTransport(config.email.nodemailer_settings)

class Mailer {
    constructor(recipients) {
        this.recipients = recipients
    }

    sendMail(subject, html, text) {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: config.email.from,
                to: this.recipients,
                subject: subject,
                text: text,
                html: html
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if (err)
                    return reject(err)

                resolve(info.response)
            })
        })
    }
}

module.exports = new Mailer(config.email.to)
