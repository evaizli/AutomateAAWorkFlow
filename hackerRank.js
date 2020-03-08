const puppeteer = require("puppeteer");
const moment = require("moment");
const email = require("./personal/password").hackerEmail;
const password = require("./personal/password").hackerPassword;

candidateArr = [
    {
        name: "Ernest Man",
        email: "ernest.man10@gmail.com",
        summary: 'T: Ernest Man',
        start: {
            dateTime: '2020-03-07T11:00:00-08:00',
            timeZone: 'America/Los_Angeles'
        }
    },

    {
        name: "Ernie Man",
        email: "ernest.man10@gmail.com",
        summary: "BPM: Ernie Man",
        start: {
            dateTime: '2020-03-07T10:00:00-08:00',
            timeZone: 'America/Los_Angeles'
        }
    }
]

// call using candidate
module.exports = (async (candidate) => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();
    
    //navigate to work login page
    await page.goto("https://www.hackerrank.com/work/login");

    //enter email
    await page.waitFor("#input-1");
    await page.waitFor(".login-form__button");
    await page.click("#input-1");
    await page.focus("#input-1");
    await page.keyboard.type(email, { delay: 5 });
    await page.waitFor(100);

    //enter password
    await page.waitFor(".login-form__button");
    await page.click(".login-form__button");
    await page.waitFor(250);
    await page.waitFor("#input-2");
    await page.click("#input-2");
    await page.focus("#input-2");
    await page.keyboard.type(password, { delay: 5 });
    await page.waitFor(100);
    await page.click(".login-form__button");

    // go to my codepairs
    await page.waitFor(".tab-link");
    await page.goto("https://www.hackerrank.com/x/interviews/mypads");

    // click new interview, fill modal form
    await page.waitFor(".js-new-interview");
    await page.click(".js-new-interview");
    await page.waitFor(".fw");
    await page.evaluate(
        (candidateEmail, candidateSummary) => {
            let inputs = document.querySelectorAll(".fw");
            console.log("INPUTS", inputs);
            inputs[0].value = candidateEmail;
            inputs[1].value = candidateSummary;
            inputs[2].click();
        },
        candidate.email,
        candidate.summary
    );

    // go to codepair page, get codepair url
    await page.waitFor(".js-invite-participants");
    await page.click(".js-invite-participants");
    await page.waitFor("#interview-link");
    const codePairLink = await page.evaluate(() => {
        return document.getElementById("interview-link").href;
    });

    // open new tab
    const page2 = await browser.newPage();
    await page2.goto(codePairLink);
    await page2.waitFor(".icon-menu-small");
    await page2.evaluate(() => {
        let sideBar = document.querySelector(".icon-menu-small.pull-right");
        sideBar.click();
    });

    // expand the hidden import question
    await page2.waitFor(".js-open-library");
    await page2.evaluate(() => {
        let openPrompts = document.querySelector(".js-open-library");
        openPrompts.click();
    });

    // click on Shared With Me button for library
    await page2.waitFor(".js-switch-library");
    await page2.evaluate(() => {
        let sharedWithMe = document.querySelector(".js-switch-library a.js-tooltip");
        sharedWithMe.click()
    })

    await page2.waitFor(1000);
    await page2.waitFor(".close");
    
    //search and select tech instructions from the modal
    await page2.evaluate(() => {
        let instructionSearch = document.getElementsByName("searchKey")[0];
        instructionSearch.value = "Tech Instructions";
        let searchButton = document.querySelector(".js-search-submit");
        searchButton.click();
    })
    await page2.waitFor(1000);
    await page2.waitFor(".js-use-question");
    await page2.evaluate(() => {
        let useQuestion = document.querySelector(".js-use-question");
        useQuestion.click();
    });

    // check for technical instructions
    await page2.waitFor(() =>
        document.querySelector(".cp_questionWrap").innerText.includes("Technical Interview")
    )

    await page2.waitFor(500)
    await page2.close();

    await page.waitFor("#interview-link");

    // this fills out the interviewer input
    const inviteURL = await page.evaluate(() => {
        let url = document.URL;
        return url;
    });
    await page.goto(inviteURL);

    // fill out candidate name
    await page.waitFor("#interview-link");
    await page.waitFor("#candidate-email");
    await page.evaluate(candidateName => {
        const nameElem = document.getElementsByName("candidate-name")[0];
        nameElem.value = candidateName;
    }, candidate.name);

    // fill out start date
    await page.waitFor("#start-date");
    await page.evaluate(() => {
        const dateElem = document.getElementById("start-date");
        const today = new Date();
        const year = today.getFullYear();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        dateElem.value = month + "-" + day + "-" + year;
    });

    // fill out start time
    await page.evaluate(candidateStart => {
        const startTime = new Date(candidateStart.dateTime)
        const formattedTime = moment(startTime).format('hh:mm');
        const timeElem = document.getElementById("start-time");
        timeElem.value = formattedTime;
    }, candidate.start);

    // UNCOMMENT TO ACTIVE COMMAND. SHOULD ALWAYS DOUBLE CHECK MEETING TIME BEFORE SEND INVITE.

    // click save interview button and open send invite modal
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
    await console.log(`HackerRank email sent to ${candidate.email}`)

    await browser.close()
});