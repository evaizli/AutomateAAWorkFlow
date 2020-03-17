### Description:

The purpose of this project is to use Google Calendar API, Gmail API, and Puppeteer API to automate the administrative work of setting up HackerRank and Zoom meeting invitations.

There are comments included in the scripts to help users understand the code and for future debugging purposes. Users are encourged to review the code before running the scripts because minor edits will be needed to personalize the meeting invite and set meeting time. The steps to setup and run the scripts are outlined below.

### Technology:

- Google Calendar API
- Gmail API
- Puppeteer

### Setup Steps:

1. Download this repo using `git clone` or download.
2. Run `npm install` in command line to install all the dependencies. You can ignore all of the warnings. 
3. Create a /personal folder within the root folder for private information like email, password, and name. This email and password will be your login information for HackerRank. You will login to your GSuite account through OAuth2. 
4. Create a `password.js` file within the personal folder. Before entering your private information, please make sure the `password.js` files is included in the `.gitignore` file. Should always double check to avoid credentials being pushed out in public.
5. In the `password.js` add your Hacker email and password (feel free to change the naming convention but please remember to update the required file path name).

   ```javascript
   module.exports = {
        hackerEmail: "eman@appacademy.io",
        hackerPassword: "password",
        hackerName: "Ernie Man"
    };
   ```


### First time set-up and authorization:

1. At the beginning of your shift, go to the root directory of this project and run `node main.js` in command-line.
2. The first time you run the script, it will prompt you to authorize access:
   - a. Go to the provided URL in your web browse. NOTE: it may say "This app isn't verified". You can ignore that and click "Advanced", then "Go to QuickStart" at the very bottom. 
   - b. You will be prompted to log in to your Google account. Here is where you will sign in using your Hacker Google Suite account and grant permission to view your Calendars and send Emails, granting authorization via OAuth2 by clicking the "Allow" button.
   - c. Copy the code given, paste it into the command line and hit Enter.
3. This will create a `token.json` file within the root directory that hold your credentials giving you authorization to view Calendars and send Emails. The `token.json` file has already included in `.gitignore`. NOTE: tokens expire, so you will have to log in and grant permission again once the token expires.

### Run main.js Script Steps:
#### ATTENTION: only run the main.js script at the beginning of your shift (within 3 hours before). The script is written to handle one shift event

1. Open the `calendars.js` file and uncomment the `hackerRank` and `sendFitEmail` invocations to allow the script to set up HackerRank and send Fit emails:

   ```javascript
   if (techs.includes(type)) {
      // UNCOMMENT call hackerRank function for all Tech candidates

      // hackerRank(candidateObj)
   } else if (fits.includes(type)) {
      // UNCOMMENT call sendFitEmail function for all Fit interviews

      // sendFitEmail(auth, candidateObj, interviewsNum)
   }    
   ```


2. At the beginning of your shift, go to the root directory of this project and run `node main.js`.
3. The script will find the first event (your shift) in your primary calendar, displaying the shift name and its start and end time, as well as all of the corresponding interviews within your shift in your terminal.
4. The script will find all of the events in the corresponding interviews calendar, parsing through each of the event details and sending emails based on if they are Tech interviews (T, BPM) or Fit interviews (NT, Fit). NOTE: As of right now, the script will not send mock interview invites. 
5. For Tech interviews, the script will open up browser(s) via Chromium that will log-in to HackerRank, fill in the meeting invite form, send the email invitation, and close the browser(s).
6. For Fit interviews, the script will send an email with the correct link to the corresponding Zoom meeting.
7. You will see email send confirmations for both HackerRank invitations and emails in the terminal.

### Notes for Future Improvement

1. Utilize HackerRank Work API
2. Integrate the script into App Academy Portal
3. Add logic for setting up Mock Interviews