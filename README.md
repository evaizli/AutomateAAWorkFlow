### Description:

The purpose of this project is to use Puppeteer API, a node library, to automate the administrative work of setting up HackerRank and Zoom meeting invitations.

### Technology:

- Puppeteer
- Google Calendar API

### Setup:

1. `Git Clone` this Repo.
2. Run `NPM install` in command line.
3. Create a personal folder within the root folder.
4. Create a `passowrd.js` file within the personal folder. The entire folder has already been included in the `.gitignore` file. Should always double check to avoid credentials being pushed out in public.
5. In the `password.js` add HackerRank and Zoom credentials (feel free to change the naming convention but please remember to update the required file path name).

### HackRank Script:

To use the HackerRank script to send invite:

1. Go to `hackerRankInvite.js` file
2. Update the `candidateEmail` && `candidateName` && `meetingTime` in military time
3. In command line, go to the root folder of this project and run `node hackerRankInvite.js`
4. The script will open up your browser and log-in to HackerRank to fill in the meeting invite form with the candidate information and meeting time.
5. The script will stop after filling in all the invite form information.
6. Manually check all the information is correctly filled and manually click `Save` and `Send Invite` to complete the process.

Note: Step 6 can be automated by uncomment the scripts at the bottom of the script. It is recommended to manually save and send invite externally after doubling checking the candidate information.

### Zoom Script:

The zoom script is still being worked on. Will push up the finished script with instructions once it’s complete.
