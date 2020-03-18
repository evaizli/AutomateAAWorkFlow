const puppeteer = require("puppeteer");
const email = require("./personal/password").hackerEmail;
const password = require("./personal/password").hackerPassword;

module.exports = (async (interview) => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });
    const page = await browser.newPage();

    // navigate to CodePair
    await page.goto(interview.url)

    // enter email
    await page.waitFor('#email');
    await page.click('#email');
    await page.focus('#email');
    await page.keyboard.type(email, {delay: 5});
    await page.waitFor(100);

    // enter password
    await page.waitFor('#password');
    await page.click('#password');
    await page.focus('#password');
    await page.keyboard.type(password, {delay: 5});
    await page.waitFor(100);

    // log in as interviewer
    await page.click(".mmT.mdB button")
    await page.waitFor(".icon-menu-small");
    await page.evaluate(() => {
        let sideBar = document.querySelector(".icon-menu-small.pull-right");
        sideBar.click();
    });

    // expand the hidden import question
    await page.waitFor(".js-open-library");
    await page.evaluate(() => {
        let openPrompts = document.querySelector(".js-open-library");
        openPrompts.click();
    });

    // click on Shared With Me button for library
    await page.waitFor(".js-switch-library");
    await page.evaluate(() => {
        let sharedWithMe = document.querySelector(".js-switch-library a.js-tooltip");
        sharedWithMe.click()
    })
    await page.waitFor(1000);
    await page.waitFor(".close");

    //search and select tech instructions from the modal
    await page.evaluate(() => {
        let instructionSearch = document.getElementsByName("searchKey")[0];
        instructionSearch.value = "Tech Instructions";
        let searchButton = document.querySelector(".js-search-submit");
        searchButton.click();
    })
    await page.waitFor(1000);
    await page.waitFor(".js-use-question");
    await page.evaluate(() => {
        let useQuestion = document.querySelector(".js-use-question");
        useQuestion.click();
    });

    // check for technical instructions
    await page.waitFor(() =>
        document.querySelector(".cp_questionWrap").innerText.includes("Technical Interview")
    )
    await page.waitFor(500)
    await browser.close()
    await console.log(`Tech Instructions set for ${interview.candidate.email}`)
});