const nodemailer = require("nodemailer")
const config = require("./config.json")

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
