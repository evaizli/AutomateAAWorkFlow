const puppeteer = require("puppeteer");

//COMMENT OR UNCOMMENT OUT THE ZOOM ACCOUNT FOR USE
// const email = require("./personal/password").zoomEmail1;
// const password = require("./personal/password").zoomPassword1;
const email = require("./personal/password").zoomEmail2;
const password = require("./personal/password").zoomPassword2;
// const email = require("./personal/password").zoomEmail3;
// const password = require("./personal/password").zoomPassword3;
// const email = require("./personal/password").zoomEmail4;
// const password = require("./personal/password").zoomPassword4;

// const candidateName = "Eve Test";

(async (email, password) => {
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

  // remove credential from window
  await page.evaluate(() => {
    window.email = null;
    window.password = null;
  });

  await page.click(".submit");

  //navigate to schedule meeting form
  await page.waitFor("#btnScheduleMeeting");
  await page.click("#btnScheduleMeeting");

  const candidateName = "Eve Test"; //cannot leave it outside && need to look into when refactor
  const time = "2:00";
  const ampm = "PM";

  //enter meeting title & description
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

  // meeting time
  //   await page.waitFor("#mt_time");
  //   await page.waitFor("#start_time");
  //   await page.evaluate(() => {
  //     const startTime = document.getElementById("start_time");
  //     startTime.value = "10:00";
  //   });

  //   //   await page.waitFor("#mt_time");
  //   await page.waitFor("start_time_2");
  //   await page.evaluate(() => {
  //     const amPm = document.getElementById("start_time_2");
  //     amPm.value = "PM";
  //   });

  //   await page.waitFor("#duration_hr");
  //   await page.evaluate(() => {
  //     const hr = document.getElementById("duration_hr");
  //     hr.value = "0";
  //   });

  //   await page.waitFor("#duration_min");
  //   await page.evaluate(() => {
  //     const durationMin = document.getElementById("duration_min");
  //     durationMin.value = "30";
  //   });

  // meeting options
  await page.waitFor("#host_video");
  await page.waitFor("#option_video_host_on");
  await page.evaluate(() => {
    const hostAudio = document.getElementById("option_video_host_on");
    hostAudio.checked = "checked";
  });

  await page.waitFor("#option_audio_both");
  await page.evaluate(() => {
    const audioOption = document.getElementById("option_audio_both");
    audioOption.checked = "checked";
  });

  await page.waitFor("#option_waiting_room");
  await page.evaluate(() => {
    const waitingRoomOption = document.getElementById("option_waiting_room");
    waitingRoomOption.checked = "checked";
  });
  // AutoRecord Off
  // await page.waitFor("#option_autorec");
  // await page.evaluate(() => {
  //   const autoRecordOption = document.getElementById("option_autorec");
  //   autoRecordOption.checked = "checked";
  // });

  // await page.waitFor("#option_autorec_cloud");
  // await page.evaluate(() => {
  //   const cloudRecord = document.getElementById("option_autorec_cloud");
  //   cloudRecord.checked = "checked";
  // });

  await page.waitForNavigation();
})(email, password);
