const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const hackerRank = require("./hackerRank");

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//     if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    // authorize(JSON.parse(content), listEvents);
// });

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

// 1. find shifts/events from primary calendar
// 2. find calendar from corresponding shift/interviews number
// 3. find candidates from correct calendar and save their emails and types into an array
// 4. based on fit/tech interview call different functions to set up
    // - hackerRank invite for techs/bpms
    // - zoom email invites for fits


// find events/first shift on primary calendar
function myEvents(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    // gets date for 3.5 hours later to later set upper and lower bound (one shift)

    // testing
    const testStart = new Date();

    testStart.setDate(testStart.getDate() + 1);

    const hoursLater = new Date();
    // hoursLater.setHours(hoursLater.getHours() + 3.5);

    hoursLater.setDate(hoursLater.getDate() + 3); // testing

    calendar.events.list({
        calendarId: 'primary',
        // timeMin: testStart.toISOString(),
        timeMin: (new Date()).toISOString(),
        timeMax: hoursLater.toISOString(),
        maxResults: 3,
        singleEvents: true,
        orderBy: "startTime"
    }, (err, res) => {
        if (err) return console.log("API Error: " + err);
        const events = res.data.items;
        if (events[0]) {
            console.log("Today's Events: ")
            // function should be called before/beginning of shift
            // function should do it for 1 shift at a time
            // find interview number from shift summary

            const shift = events[0];

            const shiftStart = shift.start.dateTime
            const shiftEnd = shift.end.dateTime

            console.log(`${shift.summary}: Start ${shiftStart} - End ${shiftEnd}`)

            const calendarIds = {
                '#1 Interviews': 'appacademy.io_s75asi05575mbos9nvofcof0f8@group.calendar.google.com',
                '#2 Interviews': 'appacademy.io_u6go5ra311hsl7c5qr42rdjgj8@group.calendar.google.com',
                '#3 Interviews': 'appacademy.io_2idda72dasldk0dfn9ak1vfb0o@group.calendar.google.com',
                '#4 Interviews': 'appacademy.io_b52b6k1dclpi8o3bq8jo1bbq70@group.calendar.google.com'
            }

            let formatSummary = shift.summary.slice(0, 13) // interview title

            // testing
            // formatSummary = "#2 Interviews"

            if (formatSummary in calendarIds) {
                console.log("Shift found")
                shiftEvents(auth, calendarIds[formatSummary], shiftStart, shiftEnd) // find events in corresponding shift
            } else {
                console.log("No shifts found")
            }
        } else {
            console.log("No upcoming events found")
        }
    })
}


// find events for the corresponding shift
function shiftEvents(auth, calendarId, start, end) { // start, end
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
        calendarId: calendarId,
        timeMin: start,
        timeMax: end,
        // maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        if (events.length) {
            console.log('Upcoming shift events:');

            const techInterviews = [];
            const fitInterviews = [];

            events.forEach( event => {
                const techs = ["BPM", "T"];
                const fits = ["Fit", "NT"];

                if (event.summary.indexOf(":") > -1) { // if event is an interview
                    const type = event.summary.slice(0, event.summary.indexOf(":")); // parse to find interview type
                    const candidateObj = {"name": ""}
                    const descArr = event.description.split("\n"); // parse through description for candidate info

                    // find first, last, email through parsing
                    for (let i = 0; i < descArr.length; i++) {
                        let info = descArr[i];
                        let infoSplit = info.split(": ");
                        if (infoSplit[0].includes("First Name")) {
                            candidateObj["name"] += infoSplit[1] + " ";
                        }
                        if (infoSplit[0].includes("Last Name")) {
                            candidateObj["name"] += infoSplit[1];
                        } else if (infoSplit[0].includes("Email")) {
                            candidateObj["email"] = infoSplit[1];
                            break
                        }
                    }

                    candidateObj["summary"] = event.summary
                    candidateObj["start"] = event.start

                    if (techs.includes(type)) {
                        techInterviews.push(candidateObj)
                    } else if (fits.includes(type)) {
                        fitInterviews.push(candidateObj)
                    }
                }
            })

            console.log(techInterviews);
            techInterviews.forEach( tech => {
                hackerRank(tech)
            })
            console.log(fitInterviews);

        } else {
            console.log('No upcoming events found.');
        }
    });
}


// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.

    authorize(JSON.parse(content), myEvents);
    // authorize(JSON.parse(content), myCalendars);
});

// const ids = {
//     'HiR Shifts': 'appacademy.io_0o8bepl91hetc3nj3nl6sbnfl8@group.calendar.google.com',
//     'Interviews 2': 'appacademy.io_u6go5ra311hsl7c5qr42rdjgj8@group.calendar.google.com',
//     'HiR SF: Ernie Man': 'eman@appacademy.io',
//     'Interviews 4': 'appacademy.io_b52b6k1dclpi8o3bq8jo1bbq70@group.calendar.google.com',
//     'Interviews 1': 'appacademy.io_s75asi05575mbos9nvofcof0f8@group.calendar.google.com',
//     'Interviews 3': 'appacademy.io_2idda72dasldk0dfn9ak1vfb0o@group.calendar.google.com',
//     "Contacts": 'addressbook#contacts@group.v.calendar.google.com'
// }

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        if (events.length) {
            console.log('Upcoming 10 events:');
            events.map((event, i) => {
                const start = event.start.dateTime || event.start.date;
                console.log(`${start} - ${event.summary}`);
            });
        } else {
            console.log('No upcoming events found.');
        }
    });
}

// Get Calendars (HiR SF, Interview 1 - 4, HiR Shifts)
function myCalendars(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.calendarList.list({}, (err, res) => {
        if (err) return console.log("API Error: " + err);

        if (res.data.items.length) {
            res.data.items.forEach(cal => {
                // if (cal.summary === "Interviews 4") { // if in the right interviews
                    shiftEvents(auth, cal.id) // list upcoming 10 events
                    console.log(cal.id.toString() + " ~ " + cal.summary)
                // }
            })
        } else {
            console.log("No calendars")
        }
    });
}