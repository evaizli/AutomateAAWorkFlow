const { google } = require('googleapis');
const moment = require("moment-timezone");

const sendFitEmail = require("./email");
const hackerRankAPI = require("./hackerRankAPI");

/**
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */


// find events/first shift on primary personal calendar
module.exports = function (auth) {
    const calendar = google.calendar({ version: 'v3', auth });

    // gets date for 3.5 hours later to later set upper and lower bound (one shift)
    const hoursLater = new Date();
    hoursLater.setHours(hoursLater.getHours() + 3.5);

    calendar.events.list({
        calendarId: 'primary', // primary => your GSuite primary calendar
        timeMin: (new Date()).toISOString(),
        timeMax: hoursLater.toISOString(),
        maxResults: 3,
        singleEvents: true,
        orderBy: "startTime"
    }, (err, res) => {
        if (err) return console.log("API Error: " + err);
        const events = res.data.items;
        if (events[0]) { // grabs only one shift
            console.log("Today's Events: ")
            // function should be called before/beginning of shift

            const shift = events[0];

            const shiftStart = shift.start.dateTime
            const shiftEnd = shift.end.dateTime

            const calendarIds = {
                '#1 Interviews': 'appacademy.io_s75asi05575mbos9nvofcof0f8@group.calendar.google.com',
                '#2 Interviews': 'appacademy.io_u6go5ra311hsl7c5qr42rdjgj8@group.calendar.google.com',
                '#3 Interviews': 'appacademy.io_2idda72dasldk0dfn9ak1vfb0o@group.calendar.google.com',
                '#4 Interviews': 'appacademy.io_b52b6k1dclpi8o3bq8jo1bbq70@group.calendar.google.com'
            }

            let formatSummary = shift.summary.slice(0, 13) // interview title

            // if you have a shift in interviews, display interviews number, shift start - shift end
            if (formatSummary in calendarIds) {
                console.log("Shift found:")
                console.log(`${shift.summary}: ${moment(shiftStart).format('MM/DD/YY h:mma')} to ${moment(shiftEnd).format('h:mma')}`)
                // find events in corresponding interviews shift from shift start to shift end
                shiftEvents(auth, calendarIds[formatSummary], shiftStart, shiftEnd, formatSummary) 
            } else {
                console.log("No shifts found")
            }
        } else {
            console.log("No upcoming events found")
        }
    })
}


// find events for the corresponding shift
function shiftEvents(auth, calendarId, start, end, interviewsNum) {
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

            const interviews = [];

            events.forEach( event => {
                const techs = ["BPM", "T", "RT"];
                const fits = ["Fit", "NT"];

                if (event.summary.indexOf(":") > -1) { // if event is an interview

                    const candidateObj = {}
                    const type = event.summary.slice(0, event.summary.indexOf(":")); // parse to find interview type
                    candidateObj["type"] = type;

                    if (event.summary.includes("Mock")) { // for mock interviews, only display summary and start date 
                        const attendees = event.attendees.map( att => att.email)
                        candidateObj["attendees"] = attendees
                        candidateObj["summary"] = `${event.summary}: ${moment(event.start.dateTime).tz(event.start.timeZone).format('MM/DD/YY h:mma z')}`;
                    } else {
                        candidateObj["name"] = ""
                        const descArr = event.description.split("\n"); // parse through description for candidate info
    
                        // find first, last, email through parsing and save to candidateObj
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
                            // UNCOMMENT call hackerRank function for all Tech candidates

                            hackerRankAPI(candidateObj)

                        } else if (fits.includes(type)) {
                            // UNCOMMENT call sendFitEmail function for all Fit interviews
    
                            sendFitEmail(auth, candidateObj, interviewsNum)
                        }
                    }
                    interviews.push(candidateObj)
                }
            })
            // show all interviews for current shift
            console.log(interviews);
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
                shiftEvents(auth, cal.id) // list upcoming 10 events
                    console.log(cal.id.toString() + " ~ " + cal.summary)
                // }
            })
        } else {
            console.log("No calendars")
        }
    });
}

// const calendarIDs = {
//     'HiR Shifts': 'appacademy.io_0o8bepl91hetc3nj3nl6sbnfl8@group.calendar.google.com',
//     'Interviews 2': 'appacademy.io_u6go5ra311hsl7c5qr42rdjgj8@group.calendar.google.com',
//     'HiR SF: Ernie Man': 'eman@appacademy.io', (Primary)
//     'Interviews 4': 'appacademy.io_b52b6k1dclpi8o3bq8jo1bbq70@group.calendar.google.com',
//     'Interviews 1': 'appacademy.io_s75asi05575mbos9nvofcof0f8@group.calendar.google.com',
//     'Interviews 3': 'appacademy.io_2idda72dasldk0dfn9ak1vfb0o@group.calendar.google.com',
//     "Contacts": 'addressbook#contacts@group.v.calendar.google.com'
// }