const logger = require('./logger.js')
const utils = require('./utils.js')

module.exports = [
    {
        name: "Walmart Xbox Series X",
        url: "https://www.walmart.com/ip/Xbox-Series-X/443574645",
        time: Date.now(),
        waitUntil: "domcontentloaded",
        setup: async (page, self) => {
            const body = await page.content()
            if (body.length > 350000)
                return

            logger.print("walmart captured by captcha, wait for load")
            await utils.sleep(12000)
        },
        func: () => {
            if (!document.querySelector(".prod-blitz-copy-message"))
                return undefined

            return !document.querySelector(".prod-blitz-copy-message").innerText.toLowerCase().includes("out of stock")
        }
    },
    {
        name: "Best Buy Xbox Series X",
        url: "https://www.bestbuy.com/site/microsoft-xbox-series-x-1tb-console-black/6428324.p?skuId=6428324",
        time: Date.now(),
        waitUntil: "domcontentloaded",
        init: async (page, self) => {
            //await page.setJavaScriptEnabled(false)
        },
        func: () => {
            if (!document.querySelector(".fulfillment-add-to-cart-button"))
                return undefined

            return !document.querySelector(".fulfillment-add-to-cart-button").innerText.toLowerCase().includes("sold out")
        }
    },
    {
        name: "Newegg Xbox Series X",
        url: "https://www.newegg.com/p/N82E16868105273?Item=N82E16868105273",
        time: Date.now(),
        init: async (page, self) => {
            await page.setJavaScriptEnabled(false)
        },
        func: () => {
            if (!document.querySelector(".product-inventory"))
                return undefined

            return !document.querySelector(".product-inventory").innerText.trim().toLowerCase().includes("out of stock")
        }
    },
    {
        name: "Target Xbox Series X",
        url: "https://www.target.com/p/xbox-series-x-console/-/A-80790841",
        time: Date.now(),
        func: () => {
            return document.querySelector(".Button__ButtonWithStyles-y45r97-0.styles__StyledButton-sc-1f2lsll-0.eLsRDh.iyUhph") !== null
        }
    },
    {
        name: "Lenovo Xbox Series X",
        url: "https://www.lenovo.com/us/en/accessories-and-monitors/consumer-electronics/gaming-consoles/Microsoft-Xbox-Series-X-game-console-1-TB-SSD/p/78015889",
        //waitUntil: "domcontentloaded",
        time: Date.now(),
        func: () => {
            if (!document.querySelector(".stock_message"))
                return undefined

            return !document.querySelector(".stock_message").innerText.toLowerCase().includes("sold out")
        }
    },
    {
        name: "Microsoft Xbox Series X",
        url: "https://www.xbox.com/en-us/configure/8wj714n3rbtl",
        time: Date.now(),
        func: () => {
            return !document.querySelector(".btn-primary") || !document.querySelector(".btn-primary").innerText.toLowerCase().includes("out of stock")
        }
    },
    {
        name: "Costco Xbox Series X",
        url: "https://www.costco.com/xbox-series-x-1tb-console-with-additional-controller.product.100691493.html",
        time: Date.now(),
        func: () => {
            return !document.querySelector(".oos-overlay") || !document.querySelector(".oos-overlay").title.toLowerCase().includes("out of stock")
        }
    },
    {
        name: "Gamestop Xbox Series X",
        url: "https://www.gamestop.com/accessories/xbox-series-x/products/xbox-series-x/11108371.html?condition=New",
        time: Date.now(),
        func: () => {
            if (!document.querySelector(".add-to-cart"))
                return undefined

            return !document.querySelector(".add-to-cart").innerText.toLowerCase().includes("not available")
        }
    },
]