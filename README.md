# scraper

### What is it?

This is a puppeteer web scraper designed to check retailer websites for item availabilities, and send an email to a configurable list of recipients when an item is available.

### Why?

When popular items are listed for sale online, it may be extremely difficult to find a website that has them in stock. 
Recently, items such as the Xbox Series X, Playstation 5, and Nvidia Geforce 3000 series cards seem almost impossible 
to order online since they go out of stock within minutes. This Node.js script helps people get notified quickly when
an item has become available, increasing their chances of being able to order one before they run out.

### How do I use it?

#### Setting up websites
---
Currently, this script is configured to scan the following websites for Xbox Series X availability:
- Walmart
- Best Buy
- Newegg
- Target
- Lenovo
- Microsoft
- Gamestop

This list can be configured in the `items.js` file. The item objects must follow the following format:
```js
[
    {
        name: "Walmart Xbox Series X",                                      // The name of the website and item
        url: "https://www.walmart.com/ip/Xbox-Series-X/443574645",          // The URL to the item page
        waitUntil: "domcontentloaded",                                      // [optional] When to start scraping the page (options at puppeteer docs)
        init: async (page, self) => {                                       // [optional] The function to execute before navigating to the URL
        },
        setup: async (page, self) => {                                      // [optional] The function to execute before scraping the page
        },
        func: () => {                                                       // The function to execute to scrape the page and check for item availability.
            if (!document.querySelector(".prod-blitz-copy-message"))        // Must return a boolean (true being available, false being unavailable). Return undefined if the page didn't load correctly.
                return undefined

            return !document.querySelector(".prod-blitz-copy-message").innerText.toLowerCase().includes("out of stock")
        }
    }
]
```
The [puppeteer docs](https://pptr.dev/#?product=Puppeteer&version=v5.5.0&show=api-pagegotourl-options) list options for waitUntil values.

If you don't understand the above code, you should ignore `items.js`.


#### Setting up emails
---
The `config.json` file contains the email configuration settings:
```js
{
    "email": {
        "from": "",                 // The email to put in the "From" field
        "to": [""],                 // The recipients of the email
        "nodemailer_settings": {    // This script uses nodemailer to send emails. Check the nodemailer docs for different service settings.
            "service": "gmail",
            "auth": {
                "user": "",
                "pass": ""
            }
        }
    }
}
```
The [nodemailer docs](https://nodemailer.com/about/#example) contain settings options. The `config.nodemailer_settings` object is passed directly to `nodemailer.createTransport()`


#### Setting up automatic captcha solving
---
Websites oftentimes prevent automated scraping by presenting a captcha to solve. This script can attempt to handle them through the [2captcha](https://2captcha.com/) service.
2captcha is a paid service ($3 per 1000 solutions) that sends the captchas to a volunteer to solve for your script.

If you choose to use 2captcha, you must create an account and retrieve an API key from your user dashboard. You can then enter the key in `config.json`:
```js
{
    "2captcha": {
        "api_token": "8zdn50135ko7do3pc4jm"
    }
}
```


#### Running the script
---
After configuring everything, you can begin running the script. First, you need [Node.js](https://nodejs.org/en/) installed. 
Then, you must run the following command in the script's directory:
```
npm install
```
<sub><sup>If you don't know how to run console commands, go [here](https://macpaw.com/how-to/use-terminal-on-mac) for MacOS 
and [here](https://www.bleepingcomputer.com/tutorials/windows-command-prompt-introduction) for Windows.</sup></sub>

After the dependencies have been installed, you can begin the basic script with:
```
npm start
```

To run a more advanced version of the script, you can run:
```
node index.js --help
Options:
      --help           Show help                                       [boolean]
      --version        Show version number                             [boolean]
  -v, --verbose        Run with verbose logging                        [boolean]
      --visual, --vis  Show the script running in Chromium             [boolean]
```

For example, to run the script with verbose logging and the browser opened, showing the script running real-time:
```
node index.js --verbose --visual
```

If the script was configured properly and dependencies were installed, the output should look similar to:
```
[11/30/20 4:19:17pm] [scraper.js:68] ✘ Walmart Xbox Series X unavailable

[11/30/20 4:19:20pm] [scraper.js:68] ✘ Best Buy Xbox Series X unavailable

[11/30/20 4:19:22pm] [scraper.js:68] ✘ Newegg Xbox Series X unavailable

[11/30/20 4:19:28pm] [scraper.js:68] ✘ Target Xbox Series X unavailable

[11/30/20 4:19:35pm] [scraper.js:68] ✘ Lenovo Xbox Series X unavailable

[11/30/20 4:19:38pm] [scraper.js:68] ✘ Microsoft Xbox Series X unavailable

[11/30/20 4:19:46pm] [scraper.js:68] ✘ Gamestop Xbox Series X unavailable
```
