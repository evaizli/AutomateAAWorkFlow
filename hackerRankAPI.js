const axios = require("axios")
const hackerEmail = require("./personal/password").hackerEmail
const hackerName = require("./personal/password").hackerName
const hackerRankApiKey = require("./personal/password").hackerRankAPIKey

// set Authorization headers for HackerRank API request
const hackerRankConfig = {
    headers: { Authorization: `Bearer ${hackerRankApiKey}`}
};

module.exports = (candidate, callback) => {
    const hourLater = new Date(candidate.start.dateTime)
    hourLater.setHours(hourLater.getHours() + 1)

    // body for creating new CodePair
    const requestBody = {
        from: candidate.start.dateTime,
        to: hourLater,
        title: candidate.summary,
        interviewers: [{ email: hackerEmail, name: hackerName }],
        candidate: { 
            name: candidate.name, 
            email: candidate.email
        },
        send_email: true
    }

    // axios call for HackerRank API post request
    axios.post(
        "https://www.hackerrank.com/x/api/v3/interviews",
        requestBody,
        hackerRankConfig
    ).then(
        res => {
            console.log(`HackerRank email sent to ${res.data.candidate.email}`)
            callback(res.data) // for calling instructions import puppeteer script
        }
    ).catch(
        err => console.log(err.response)
    )
}