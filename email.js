const hackerEmail = require("./personal/password").hackerEmail;
const hackerName = require("./personal/password").hackerName;

const {google} = require("googleapis")
const MIMEText = require("mimetext");
const moment = require("moment-timezone");

function emailTemplate(candidate, interviewsNum) {

    // we need MIMEText to convert the email message into base64 encoded RFC 2822 format for the gmail API
    const message = new MIMEText();

    // setting up the email template
    const zoomLinks = {
        '#1 Interviews': 'https://zoom.us/j/2203925161',
        '#2 Interviews': 'https://zoom.us/j/6025476052',
        '#3 Interviews': 'https://zoom.us/j/9469617654',
        '#4 Interviews': 'https://zoom.us/j/7010599780'
    }

    const formattedDate = moment(candidate.start.dateTime).tz(candidate.start.timeZone).format("MM/DD/YY h:mma z")
    
    const body = `
    Hi ${candidate.name.split(" ")[0]},\n
    Your App Academy interview is scheduled for ${formattedDate}.\n
    At the scheduled start time, please follow this link:\n
    ${zoomLinks[interviewsNum]}\n
    Once there, click the JOIN MEETING button.\n
    This interview will be recorded for evaluation and quality assurance.\n
    Best,\n
    ${hackerName}
    Technical Admissions Specialist
    App Academy
    `

    message.setSender( {name: hackerName, addr: hackerEmail} )
    message.setRecipient( {name: candidate.name, addr: candidate.email } )
    message.setSubject("App Academy Interview Link")
    message.setMessage(body)

    // returns base64 encoded RFC 2822 email
    return message.asEncoded()
}

module.exports = function (auth, candidate, interviewsNum) {
    const gmail = google.gmail({ version: 'v1', auth });

    // get the encoded email
    let encodedEmail = emailTemplate(candidate, interviewsNum);

    // calls the gmail API, userId => your google account
    gmail.users.messages.send({
        "userId": 'me',
        'resource': {
            'raw': encodedEmail
        }
    }, (err, res) => {
        if (err) console.log("API Error: " + err)

        console.log(`Zoom email sent to ${candidate.email}`)
    })
}