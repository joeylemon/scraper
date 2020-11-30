const logger = require("./logger.js")

const DEACTIVATE_TIME = 60000 * 60

class Proxies {
    constructor(list) {
        this.list = list
    }

    rand() {
        const activatedProxies = this.list.filter(a => !a.deactivated || Date.now() > a.deactivated)

        if (activatedProxies.length === 0) {
            logger.print("no more proxies left to use")
            return ""
        }

        return activatedProxies[Math.floor(Math.random() * activatedProxies.length)].url
    }

    deactivate(addr) {
        const proxy = this.list.find(a => a.url === addr)

        if (proxy) {
            proxy.deactivated = Date.now() + DEACTIVATE_TIME
        } else {
            logger.printf("could not deactivate proxy %s, not found", addr)
        }
    }
}

module.exports = new Proxies([
    {url: "http://45.82.245.34:3128"},
    {url: "http://208.80.28.208:8080"},
    {url: "http://50.17.139.35:3128"},
    {url: "http://23.146.144.13:3128"},
    {url: "http://62.210.136.88:3128"},
    {url: "http://163.172.82.253:3128"},
    {url: "http://113.116.197.87:8888"},
    {url: "http://45.167.30.82:8080"},
    {url: "http://208.80.28.208:8080"},
    {url: "http://104.156.250.227:3128"},
    {url: "http://152.26.66.140:3128"},
    {url: "http://51.89.32.83:3128"},
    {url: "http://209.165.163.187:3128"},
    {url: "http://135.181.36.161:8888"},
])