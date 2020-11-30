const fakeagent = require('fake-useragent')

async function createPage(browser) {
    const page = await browser.newPage()

    //Randomize viewport size
    await page.setViewport({
        width: 1920 + Math.floor(Math.random() * 100),
        height: 3000 + Math.floor(Math.random() * 100),
        deviceScaleFactor: 1,
        hasTouch: false,
        isLandscape: false,
        isMobile: false,
    })

    await page.setUserAgent(fakeagent())
    await page.setJavaScriptEnabled(true)
    await page.setDefaultNavigationTimeout(0)
    await page.setGeolocation({latitude: 35.9306521, longitude: -85.4875559})

    // Skip images/styles/fonts loading for performance
    // await page.setRequestInterception(true)
    // page.on('request', (req) => {
    //     if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
    //         req.abort()
    //     } else {
    //         req.continue()
    //     }
    // })

    return page
}

module.exports = createPage