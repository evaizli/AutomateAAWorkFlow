const puppeteer = require("puppeteer");
const email = require("./personal/password").zoomEmail1;
const password = require("./personal/password").zoomPassword1;
// const email = require("./personal/password").zoomEmail2;
// const password = require("./personal/password").zoomPassword2;
// const email = require("./personal/password").zoomEmail3;
// const password = require("./personal/password").zoomPassword3;
// const email = require("./personal/password").zoomEmail4;
// const password = require("./personal/password").zoomPassword4;

// const candidateName = "Eve Test";

(async (email, password) => {
  const candidateName = "Eve Test"; //cannot leave it outside
  const time = "11:00";
  const ampm = "AM";

  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  //navigate to page
  await page.goto("https://www.zoom.us/signin");
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

  await page.click(".submit");
  await page.waitFor("#btnScheduleMeeting");
  await page.click("#btnScheduleMeeting");

  await page.waitFor("#topic");

  //   await page.evaluate(candidateName => {
  //     window.candidateName = candidateName;
  //   }, candidateName);

  await page.evaluate(candidateName => {
    let topic = document.getElementById("topic");
    topic.value = `App Academy Interview with ` + candidateName;
  }, candidateName);

  await page.evaluate(() => {
    let agenda = document.getElementById("agenda");
    agenda.value = "App Academy Non-technical Interview";
  });

  await page.evaluate(time => {
    const startTime = document.getElementById("start_time");
    startTime.value = time;
  }, time);
  await page.evaluate(ampm => {
    const amPm = document.getElementById("start_time_2");
    amPm.value = ampm;
  }, ampm);

  await page.evaluate(() => {
    const durationHour = document.getElementById("duration_hr");
    durationHour.value = 0;
  });
  await page.evaluate(() => {
    const durationMinute = document.getElementById("duration_min");
    durationMinute.value = 30;
  });
  await page.evaluate(() => {
    const hostVideoOption = document.getElementById("option_video_host_on");
    hostVideoOption.checked = "checked";
  });
  await page.evaluate(() => {
    const audioOption = document.getElementById("option_audio_both");
    audioOption.checked = "checked";
  });
  await page.evaluate(() => {
    const waitingRoomOption = document.getElementById("option_waiting_room");
    waitingRoomOption.checked = "checked";
  });
  await page.evaluate(() => {
    const recordOption = document.getElementById("option_autorec_cloud");
    recordOption.checked = "checked";
  });

  await page.click(".submit");
  //   await page.$eval(
  //     "#topic",
  //     el => (el.val = `App Academy Interview with ` + window.candidateName)
  //   );
  //   await page.evaluate(() => {
  //     window.candidateName = null;
  //   });
  // //candidate information
  // const candidateEmail = "eva.li.pan@gmail.com";
  // const name = "Evan Fan";
  // const interviewType = "App Academy Technical Interview -" + name;

  // await page.waitFor(".tab-link");
  // await page.goto("https://www.hackerrank.com/x/interviews/mypads");
  // await page.waitFor(".js-new-interview");
  // await page.click(".js-new-interview");
  // await page.waitFor(".fw");
  // await page.$eval(".fw", el => (el.value = email));
  // await page.$eval(".fw", el => (el.value = name));

  // await page.evaluate(
  //     (email, interviewType) => {
  //         let inputs = document.querySelectorAll(".fw");
  //         console.log("INPUTS", inputs);
  //         inputs[0].value = email;
  //         inputs[1].value = interviewType;
  //         inputs[2].click();
  //         // debugger
  //     },
  //     email,
  //     interviewType
  // );
  // await page.waitFor(".js-invite-participants");
  // await page.click(".js-invite-participants");

  // await page.waitFor("candidate-container");

  // await page.evaluate(name => {
  //     let container = document.getElementById("candidate-container");
  //     container.children[0].value = name;
  //     console.log(name);
  // }, name);

  // //   await page.waitFor("#title-container");
  // //   await page.click("#interview-link");

  // //   await page.waitFor(".cp_sideHead");
  // //   await page.click(".js-open-library.btn.btn-green.block-center");

  // //

  await page.waitForNavigation();
})(email, password);
