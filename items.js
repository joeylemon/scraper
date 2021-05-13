const logger = require('./logger.js')
const utils = require('./utils.js')

const items = [
    {
        name: "NowInStock Xbox Series X",
        url: "https://www.nowinstock.net/videogaming/consoles/microsoftxboxseriesx/",
        func: () => {
            const items = Array.from(document.querySelector("#data").querySelector("table").querySelectorAll("tr")).filter(e => e.querySelectorAll("td").length > 0).map(e => {
                const td = Array.from(e.querySelectorAll("td"))
                return {
                    name: td[0].innerText,
                    available: td[1].innerText.toLowerCase().includes("in stock")
                }
            })

            console.log("NowInStock items: %s", items.map(e => `${e.name} (${e.available ? "in stock" : "out of stock"})`).join(", "))

            return items.filter(e => e.available && e.name.toLowerCase().includes("xbox series x")).length > 0
        }
    },
    {
        name: "StockInformer Xbox Series X",
        url: "https://www.stockinformer.com/checker-xbox-series-x-console",
        func: () => {
            const items = Array.from(document.querySelector("#TblProduct1").querySelectorAll("tr")).filter(e => e.querySelectorAll("td").length > 1).map(e => {
                const td = e.querySelectorAll("td")
                return {
                    source: td[0].querySelector("img") ? td[0].querySelector("img").alt : td[0].querySelector("a").innerText,
                    name: td[1].innerText,
                    available: td[2].querySelector("span").innerText.toLowerCase().includes("in stock")
                }
            })

            console.log("StockInformer items: %s", items.map(e => `${e.name} (${e.available ? "in stock" : "out of stock"})`).join(", "))

            return items.filter(e => e.available && !e.source.toLowerCase().includes("ebay") && !e.source.toLowerCase().includes("stockx") && !e.name.toLowerCase().includes("bundle")).length > 0
        }
    },
    // {
    //     name: "Walmart Xbox Series X",
    //     url: "https://www.walmart.com/ip/Xbox-Series-X/443574645",
    //     waitUntil: "domcontentloaded",
    //     setup: async (page, self) => {
    //         const body = await page.content()
    //         if (body.length > 350000)
    //             return

    //         logger.print("walmart captured by captcha, wait for load")
    //         await utils.sleep(12000)
    //     },
    //     func: () => {
    //         if (!document.querySelector(".prod-blitz-copy-message"))
    //             return undefined

    //         return !document.querySelector(".prod-blitz-copy-message").innerText.toLowerCase().includes("out of stock")
    //     }
    // },
    {
        name: "Best Buy Xbox Series X",
        url: "https://www.bestbuy.com/site/microsoft-xbox-series-x-1tb-console-black/6428324.p?skuId=6428324",
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
        func: () => {
            return document.querySelector(".Button__ButtonWithStyles-y45r97-0.styles__StyledButton-sc-1f2lsll-0.eLsRDh.iyUhph") !== null
        }
    },
    {
        name: "Lenovo Xbox Series X",
        url: "https://www.lenovo.com/us/en/accessories-and-monitors/consumer-electronics/gaming-consoles/Microsoft-Xbox-Series-X-game-console-1-TB-SSD/p/78015889",
        //waitUntil: "domcontentloaded",
        func: () => {
            if (!document.querySelector(".stock_message"))
                return undefined

            return !document.querySelector(".stock_message").innerText.toLowerCase().includes("sold out")
        }
    },
    {
        name: "Microsoft Xbox Series X",
        url: "https://www.xbox.com/en-us/configure/8wj714n3rbtl",
        func: () => {
            return !document.querySelector(".btn-primary") || !document.querySelector(".btn-primary").innerText.toLowerCase().includes("out of stock")
        }
    },
    {
        name: "Costco Xbox Series X",
        url: "https://www.costco.com/xbox-series-x-1tb-console-with-additional-controller.product.100691493.html",
        func: () => {
            return !document.querySelector(".oos-overlay") || !document.querySelector(".oos-overlay").title.toLowerCase().includes("out of stock")
        }
    },
    {
        name: "Gamestop Xbox Series X",
        url: "https://www.gamestop.com/accessories/xbox-series-x/products/xbox-series-x/11108371.html?condition=New",
        func: () => {
            if (!document.querySelector(".add-to-cart"))
                return undefined

            return !document.querySelector(".add-to-cart").innerText.toLowerCase().includes("not available")
        }
    },
]

items.forEach(e => {
    e.time = Date.now()
    e.lastAvailable = 0
})

module.exports = items