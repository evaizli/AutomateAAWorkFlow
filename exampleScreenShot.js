const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://evapan.com/');
    await page.screenshot({ path: 'epan.png' });

    await browser.close();
})();///() invoking the function 


///