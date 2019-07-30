const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://evapan.com/');
    await page.screenshot({ path: 'epan.png' });

    await browser.close();
})();