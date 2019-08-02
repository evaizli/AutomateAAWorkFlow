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
  const name = "Evan Fan";
  const interviewType = "App Academy Technical Interview -" + name;

  await page.waitFor(".tab-link");
  await page.goto("https://www.hackerrank.com/x/interviews/mypads");
  await page.waitFor(".js-new-interview");
  await page.click(".js-new-interview");
  await page.waitFor(".fw");
  await page.$eval(".fw", el => (el.value = email));
  await page.$eval(".fw", el => (el.value = name));

  await page.evaluate(
    (email, interviewType) => {
      let inputs = document.querySelectorAll(".fw");
      console.log("INPUTS", inputs);
      inputs[0].value = email;
      inputs[1].value = interviewType;
      inputs[2].click();
      // debugger
    },
    email,
    interviewType
  );
  await page.waitFor(".js-invite-participants");
  await page.click(".js-invite-participants");

  await page.waitFor("candidate-container");

  await page.evaluate(name => {
    let container = document.getElementById("candidate-container");
    container.children[0].value = name;
    console.log(name);
  }, name);

  //   await page.waitFor("#title-container");
  //   await page.click("#interview-link");

  //   await page.waitFor(".cp_sideHead");
  //   await page.click(".js-open-library.btn.btn-green.block-center");

  //

  await page.waitForNavigation();

  // await page.type('#twotabsearchtextbox', 'nyan cat pullover')
  // await page.click('input.nav-input')
  // await page.waitForSelector('#resultsCol')
  // await page.screenshot({ path: 'amazon_nyan_cat_pullovers_list.png' })
  // await page.click('#pagnNextString')
  // await page.waitForSelector('#resultsCol')
  // const pullovers = await page.$$('a.a-link-normal.a-text-normal')
  // await pullovers[2].click()
  // await page.waitForSelector('#ppd')
  // await page.screenshot({ path: screenshot })
  // await browser.close()
  // console.log('See screenshot: ' + screenshot)
})(email, password);
