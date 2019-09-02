const puppeteer = require("puppeteer");
const email = require("./personal/password").hackerEmail;
const password = require("./personal/password").hackerPassword;
(async (email, password) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 700 });

  //CANDIDATE INFORMATION: FILL IN CANDIDATE INFORMATION BEFORE RUNNING THE SCRIPT
  const candidateEmail = "eva.li.pan@gmail.com";
  const candidateName = "Eva Pan";
  const interviewType = "App Academy Technical Interview -" + candidateName;
  const meetingTime = "11:00";

  //navigate to page
  await page.goto("https://www.hackerrank.com/work/login");
  await page.waitFor("#input-1");
  await page.waitFor(".login-form__button");

  await page.evaluate(email => {
    window.email = email;
  }, email);

  await page.$eval("#input-1", el => (el.value = window.email));

  await page.evaluate(() => {
    window.email = null;
  });

  await page.waitFor(".login-form__button");
  // await page.click(".login-form__button");

  // await page.waitFor("#password");

  //log-in
  //adding credential to the window
  // await page.evaluate(
  //   (email, password) => {
  //     window.email = email;
  //     window.password = password;
  //   },
  //   email,
  //   password
  // );

  // await page.$eval("#password", el => (el.value = window.password));

  // // remnove credential from window
  // await page.evaluate(() => {
  //   window.email = null;
  //   window.password = null;
  // });

  // await page.click(".signupBtn");

  // await page.waitFor(".tab-link");
  // await page.goto("https://www.hackerrank.com/x/interviews/mypads");
  // await page.waitFor(".js-new-interview");
  // await page.click(".js-new-interview");
  // await page.waitFor(".fw");

  // // add candidate info and email for the invite
  // await page.evaluate(
  //   (candidateEmail, interviewType) => {
  //     let inputs = document.querySelectorAll(".fw");
  //     console.log("INPUTS", inputs);
  //     inputs[0].value = candidateEmail;
  //     inputs[1].value = interviewType;
  //     inputs[2].click();
  //   },
  //   candidateEmail,
  //   interviewType
  // );

  // //invite form

  // await page.waitFor(".js-invite-participants");
  // await page.click(".js-invite-participants");

  // await page.waitFor("#interview-link");
  // const codePairLink = await page.evaluate(() => {
  //   return document.getElementById("interview-link").href;
  // });
  // // open new page & set up codepair environment
  // const page2 = await browser.newPage();
  // await page2.setViewport({ width: 1280, height: 700 });
  // await page2.goto(codePairLink);

  // await page2.waitFor(".icon-menu-small");
  // await page2.evaluate(() => {
  //   let sideBar = document.querySelector(".icon-menu-small.pull-right");
  //   sideBar.click();
  // });

  // //expand the hidden import question
  // await page2.waitFor(".js-open-library");

  // await page2.evaluate(() => {
  //   let openPrompts = document.querySelector(".js-open-library");
  //   openPrompts.click();
  // });

  // //search and select instruction from the modal
  // await page2.waitFor(".close");

  // await page2.evaluate(() => {
  //   let instructionSearch = document.getElementsByName("searchKey")[0];
  //   instructionSearch.value = "Tech Interview Instructions";
  //   let searchButton = document.querySelector(".js-search-submit");
  //   searchButton.click();
  // });

  // await page2.waitFor(".js-use-question");

  // await page2.evaluate(() => {
  //   let useQuestion = document.querySelector(".js-use-question");
  //   useQuestion.click();
  // });

  // //return the main page and close page2
  // await page2.waitFor(".icon-menu-small");
  // await page2.close();

  // await page.goForward();
  // await page.waitFor("#interview-link");

  // const inviteURL = await page.evaluate(() => {
  //   let url = document.URL;
  //   return url;
  // });

  // await page.goto(inviteURL);
  // await page.waitFor("#interview-link");

  // await page.waitFor("#candidate-email");

  // await page.evaluate(candidateName => {
  //   const nameElem = document.getElementsByName("candidate-name")[0];
  //   nameElem.value = candidateName;
  // }, candidateName);

  // await page.waitFor("#start-date");

  // await page.evaluate(() => {
  //   const dateElem = document.getElementById("start-date");
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const day = today.getDate();
  //   const month = today.getMonth() + 1;
  //   dateElem.value = month + "-" + day + "-" + year;
  // });

  // await page.evaluate(meetingTime => {
  //   const timeElem = document.getElementById("start-time");
  //   timeElem.value = meetingTime;
  // }, meetingTime);

  //UNCOMMENT TO ACTIVE COMMAND. SHOULD ALWAYS DOUBLE CHECK MEETING TIME BEFORE SEND INVITE.

  // await page.click("#interview-update");

  // await page.waitFor(".hr-dialog-button");
  // await page.waitFor(".btn-primary");

  //DO NOT SEND invites to all participants
  // await page.evaluate(() => {
  //   const doNotSend = document.querySelector(".hr-dialog-button");
  //   doNotSend.click();
  // });

  //SEND invites to all participants
  // await page.evaluate(() => {
  //   const sendInvite = document.querySelector(".btn-primary");
  //   sendInvite.click();
  // });

  await page.waitFor("#interview-update");
  await page.waitForNavigation();
})(email, password);
