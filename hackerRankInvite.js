const puppeteer = require("puppeteer");
const email = require("./personal/password").hackerEmail;
const password = require("./personal/password").hackerPassword;

(async (email, password) => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  //CANDIDATE INFORMATION: FILL IN CANDIDATE INFORMATION BEFORE RUNNING THE SCRIPT
  const candidateEmail = "ernest.man10@gmail.com";
  const candidateName = "Ernest Man"
  const interviewType = "App Academy Technical Interview -" + candidateName;
  const meetingTime = "20:00"; //must be military time

  //navigate to page
  await page.goto("https://www.hackerrank.com/work/login");
  //enter email
  await page.waitFor("#input-1");
  await page.waitFor(".login-form__button");
  await page.click("#input-1");
  await page.focus("#input-1");
  await page.keyboard.type(email, { delay: 10 });
  await page.waitFor(200);
  //enter password
  await page.waitFor(".login-form__button");
  await page.click(".login-form__button");
  await page.waitFor(500);
  await page.waitFor("#input-2");
  await page.click("#input-2");
  await page.focus("#input-2");
  await page.keyboard.type(password, { delay: 10 });
  await page.waitFor(200);
  await page.click(".login-form__button");

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
  // open new page & set up codepair environment
  const page2 = await browser.newPage();
  await page2.goto(codePairLink);

  await page2.waitFor(".icon-menu-small");
  await page2.evaluate(() => {
    let sideBar = document.querySelector(".icon-menu-small.pull-right");
    sideBar.click();
  });

  //expand the hidden import question
  await page2.waitFor(".js-open-library");

  await page2.evaluate(() => {
    let openPrompts = document.querySelector(".js-open-library");
    openPrompts.click();
  });

  await page2.waitFor(".js-switch-library");
  await page2.evaluate(() => {
    let sharedWithMe = document.querySelector(".js-switch-library");
    sharedWithMe.click()
  })

  //search and select instruction from the modal
  await page2.waitFor(".close");

  await page2.evaluate(() => {
    let instructionSearch = document.getElementsByName("searchKey")[0];
    instructionSearch.value = "Tech Instructions";
    let searchButton = document.querySelector(".js-search-submit");
    searchButton.click();
  })

  await page2.waitFor(1500);
  await page2.waitFor(".js-use-question");
  // await page2.waitForFunction('document.querySelector(".span-flex-9").innerText.includes("Tech Instructions)')

  await page2.evaluate(() => {
    let useQuestion = document.querySelector(".js-use-question");
    useQuestion.click();
  });

  // await page2.waitFor(".icon-menu-small");

  // check for technical instructions
  await page2.waitFor(() =>
    document.querySelector(".cp_questionWrap").innerText.includes("Technical Interview")
  )

  await page2.waitFor(1000)
  await page2.close();

  // await page.goForward();

  await page.waitFor("#interview-link");

  // this fills out the interviewer input
  const inviteURL = await page.evaluate(() => {
    let url = document.URL;
    return url;
  });
  await page.goto(inviteURL);

  await page.waitFor("#interview-link");

  await page.waitFor("#candidate-email");

  await page.evaluate(candidateName => {
    const nameElem = document.getElementsByName("candidate-name")[0];
    nameElem.value = candidateName;
  }, candidateName);

  await page.waitFor("#start-date");

  await page.evaluate(() => {
    const dateElem = document.getElementById("start-date");
    const today = new Date();
    const year = today.getFullYear();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    dateElem.value = month + "-" + day + "-" + year;
  });

  await page.evaluate(meetingTime => {
    const timeElem = document.getElementById("start-time");
    timeElem.value = meetingTime;
  }, meetingTime);

  // UNCOMMENT TO ACTIVE COMMAND. SHOULD ALWAYS DOUBLE CHECK MEETING TIME BEFORE SEND INVITE.

  await page.click("#interview-update");

  await page.waitFor(".hr-dialog-buttons");
  await page.waitFor(".btn-primary");

  // DO NOT SEND invites to all participants
  // await page.evaluate(() => {
  //   const doNotSend = document.querySelector(".hr-dialog-button");
  //   doNotSend.click();
  // });

  // SEND invites to all participants
  // await page.evaluate(() => {
  //   const inviteButtons = document.querySelectorAll(".hr-dialog-buttons button");
  //   const sendInvite = inviteButtons[inviteButtons.length - 1];
  //   sendInvite.click();
  // });

  // await page.waitFor(".ajax-msg");
  // await page.waitFor(() =>
  //   document.querySelector(".ajax-msg").innerText.includes("Email Sent Successfully")
  // )

  // await page.waitFor("#interview-update");
  await page.waitForNavigation();
})(email, password);
