const puppeteer = require("puppeteer");
const email = require("./personal/password").hackerEmail;
const password = require("./personal/password").hackerPassword;
(async (email, password) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  //navigate to page
  await page.goto("https://www.hackerrank.com/work/login");
  await page.waitFor("#email");
  await page.waitFor("#password");

  //log-in
  //adding to the window
  await page.evaluate(
    (email, password) => {
      window.email = email;
      window.password = password;
    },
    email,
    password
  );

  await page.$eval("#email", el => (el.value = window.email));
  await page.$eval("#password", el => (el.value = window.password));

  // remnove credential from window
  await page.evaluate(() => {
    window.email = null;
    window.password = null;
  });

  await page.click(".signupBtn");

  //candidate information
  const candidateEmail = "eva.li.pan@gmail.com";
  const candidateName = "Evan Fan";
  const interviewType = "App Academy Technical Interview -" + candidateName;

  await page.waitFor(".tab-link");
  await page.goto("https://www.hackerrank.com/x/interviews/mypads");
  await page.waitFor(".js-new-interview");
  await page.click(".js-new-interview");
  await page.waitFor(".fw");
  // add candidate info and email for the invite
  await page.evaluate(
    (candidateEmail, interviewType) => {
      let inputs = document.querySelectorAll(".fw");
      console.log("INPUTS", inputs);
      inputs[0].value = candidateEmail;
      inputs[1].value = interviewType;
      inputs[2].click();
    },
    candidateEmail,
    interviewType
  );

  //invite form

  await page.waitFor(".js-invite-participants");
  await page.click(".js-invite-participants");

  await page.waitFor("#interview-link");
  const codePairLink = await page.evaluate(() => {
    return document.getElementById("interview-link").href;
  });
  // open new page
  const page2 = await browser.newPage();
  await page2.setViewport({ width: 1280, height: 800 });
  await page2.goto(codePairLink);

  await page2.waitFor(".icon-menu-small");
  await page2.evaluate(() => {
    let sideBar = document.querySelector(".icon-menu-small.pull-right");
    sideBar.click();
  });

  await page2.waitFor(".js-open-library");

  await page2.evaluate(() => {
    let openPrompts = document.querySelector(".js-open-library");
    openPrompts.click();
  });

  await page.waitForNavigation();
  await page2.waitForNavigation();
})(email, password);
