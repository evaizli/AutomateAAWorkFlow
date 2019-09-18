### Description:

The purpose of this project is to use Puppeteer API, a node library, to automate the administrative work of setting up HackerRank and Zoom meeting invitations.

There are comments included in the scripts to help users understand the code and for future debugging purposes. Users are encourged to review the code before running the scripts because minor edits will be needed to personalize the meeting invite and set meeting time. The steps to setup and run the scripts are outlined below.

### Technology:

- Puppeteer

### Setup Steps:

1. Download this repo using `Git Clone` or download.
2. Run `NPM install` in command line to install all the dependencies.
3. Create a personal folder within the root folder for priviate information like username and password.
4. Create a `passowrd.js` file within the personal folder. Before entering your priviate information, please make sure the `password.js` files is included in the `.gitignore` file. Should always double check to avoid credentials being pushed out in public.
5. In the `password.js` add your HackerRank and Zoom credentials (feel free to change the naming convention but please remember to update the required file path name).

   ```
   //EXAMPLE
   module.exports = {
        hackerEmail: "example@email.com",
        hackerPassword: "password",
        zoomEmail1: "example@email.com",
        zoomPassword1: "password",
        zoomEmail2: "example2@email.com",
        zoomPassword2: "password",
        zoomEmail3: "example3@email.com",
        zoomPassword3: "password",
        zoomEmail4: "example@email.com",
        zoomPassword4: "password",
    };
   ```

### Run HackerRank Script Steps:

1. Open `hackerRankInvite.js` file to add meeting detail.
2. Update the `candidateEmail`, `candidateName`, `meetingTime` in military time.

   ```
   //EXAMPLE
   const candidateEmail = "example@email.com";
   const candidateName = "Alexander Hamilton";
   const interviewType = "App Academy Technical Interview -" + candidateName;
   const meetingTime = "11:00"; //need to be military time

   ```

3. In command line, go to the root folder of this project and run `node hackerRankInvite.js`.
4. The script will open up your browser and log-in to HackerRank to fill in the meeting invite form with the candidate information and meeting time.
5. The script will stop after filling in all the invite form information.
6. Manually check all the information is correctly filled and manually click `Save` and `Send Invite` to complete the process.

Note: Step 6 can be automated by uncommenting the codes at the bottom of the HackerRank script file. It is recommended to manually save and send invite externally after doubling checking the candidate information.

### Run Zoom Script Steps:

1. Open `zoomInvite.js` file to add meeting detail.
2. Check the `email` and `password` to make sure the correct zoom account is commented in for interview shift. Make sure to add the zoom account credentials in the `password.js` file.
3. Update `candidateName`, meetign `time`, and mornign or afternnon `ampm`.
4. If needed update the duration. The default is 1 hour.

   ```
    //EXAMPLE:
       const candidateName = "Eve Test";
        const time = "2:00";
       const ampm = "AM"; //need to be capitalized

    //Meeting duration:
    //ex: for 1 hour meeting, set hour = "1" and minute = "0"
    //ex: for 30 minute meeting. set hour = "0" and minute = "30"
       const hour = "1";
       const minute = "0";
   ```

5. Go to command line and run `node zoomInvite.js`. The script will open up your browser and log-in to the zoom account and fill out the meeting information. It will stop once all the information is filled.
6. Manually check to make sure the information is correctly filled.
7. Manually click "Save" to schedule the meeting.

Note: Step 7 can be automated by uncommenting the code at the bottom of the Zoom invite script file. It is recommended to manually save the meeting.

### Notes for Future Improvement

1. Intergrate Google Calender API to get all the name and email of candidates for shift.
2. Intergrate Google Calender API to send zoom meeting link to candidate with custom message.
