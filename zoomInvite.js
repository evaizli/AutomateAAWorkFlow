const puppeteer = require("puppeteer");

//COMMENT OR UNCOMMENT OUT THE ZOOM ACCOUNT FOR USE
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
  const candidateName = "Eve Test"; //cannot leave it outside && need to look into when refactor
  const time = "2:00";
  const ampm = "AM";
  //Meeting duration:
  //ex: for 1 hour meeting, set hour = "1" and minute = "0"
  //ex: for 30 minute meeting. set hour = "0" and minute = "30"
  const hour = "0";
  const minute = "30";

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

  //remove credential from window
  await page.evaluate(() => {
    window.email = null;
    window.password = null;
  });

  await page.click(".submit");

  //navigate to schedule meeting form
  await page.waitFor("#btnScheduleMeeting");
  await page.click("#btnScheduleMeeting");

  //filling meeting title & description
  await page.waitFor("#topic");
  await page.evaluate(candidateName => {
    let topic = document.getElementById("topic");
    topic.value = `App Academy Interview with ` + candidateName;
  }, candidateName);

  await page.waitFor("#agenda");
  await page.evaluate(() => {
    let agenda = document.getElementById("agenda");
    agenda.value = "App Academy Non-technical Interview";
  });

  //filling start time
  await page.waitFor("#mt_time");
  await page.waitFor("#start_time");
  await page.waitFor(".controls.col-md-10.static");
  await page.waitFor(".time-select");
  await page.waitFor(".short-select");
  await page.waitFor(".zm-select");
  await page.waitFor(".zm-select-input");
  await page.waitFor(".z-form-row");
  await page.waitFor("#meetingVideo");
  await page.waitFor(".controls.col-md-10");

  await page.waitFor("#start_time");
  await page.evaluate(time => {
    let startTime = document.getElementById("start_time");
    startTime.value = time;
  }, time);
  await page.waitFor("#start_time_2");
  await page.evaluate(ampm => {
    const morningAfternoon = document.getElementById("start_time_2");
    morningAfternoon.value = ampm;
  }, ampm);

  //filling meeting duration
  await page.waitFor(".duration-controls");
  await page.waitFor("#duration_hr");
  await page.evaluate(hour => {
    const hr = document.getElementById("duration_hr");
    hr.value = hour;
  }, hour);
  await page.waitFor("#duration_min");
  await page.evaluate(minute => {
    const durationMin = document.getElementById("duration_min");
    durationMin.value = minute;
  }, minute);

  //filling video option
  await page.waitFor("#option_video_host_on");
  await page.evaluate(() => {
    const hostVideoOption = document.getElementById("option_video_host_on");
    hostVideoOption.checked = "checked";
  });

  // await page.waitFor("#option_audio_both");
  // await page.evaluate(() => {
  //   const audioOption = document.getElementById("option_audio_both");
  //   audioOption.checked = "checked";
  // });

  // await page.evaluate(() => {
  //   const waitingRoomOption = document.getElementById("option_waiting_room");
  //   waitingRoomOption.checked = "checked";
  // });
  // await page.evaluate(() => {
  //   const recordOption = document.getElementById("option_autorec_cloud");
  //   recordOption.checked = "checked";
  // });

  // await page.click(".submit");

  await page.waitForNavigation();
})(email, password);
