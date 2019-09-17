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

### HackerRank Script:

1. Go to `hackerRankInvite.js` file.
2. Update the `candidateEmail` && `candidateName` && `meetingTime` in military time.
3. In command line, go to the root folder of this project and run `node hackerRankInvite.js`.
4. The script will open up your browser and log-in to HackerRank to fill in the meeting invite form with the candidate information and meeting time.
5. The script will stop after filling in all the invite form information.
6. Manually check all the information is correctly filled and manually click `Save` and `Send Invite` to complete the process.

Note: Step 6 can be automated by uncommenting the scripts at the bottom of the HackerRank script file. It is recommended to manually save and send invite externally after doubling checking the candidate information.

### Zoom Script:

The zoom script is still being worked on. Will push up the finished script with instructions once it’s complete.
