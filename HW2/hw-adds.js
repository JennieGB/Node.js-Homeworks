const program = require('commander');

const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const inquirer = require('inquirer');
const authGoogle = require('auth-google');
const validator = require('validator');

const google = require('googleapis');
const gcal = google.calendar('v3');

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2();

const index = require('./index.js');

program
    .version(index.VERSION)
    .usage('<title> <date & time> [options]')
    .option('-d, --desc <value>', 'Description of homework assignment')
    .parse(process.argv);

//If index file missing or invalid, prompt user to run init
 

// Check for existence of index.json in module directory
if(!fs.existsSync(path.join(__dirname, 'index.json'))
    && program.args[0] !== 'init') {
    // Prompt user
    console.log('  Homework-CLI: Before continuing, run `hw init`.');
    process.exit(0);
}

//Add homework to calendar

// First retrieve access token from index file
const genIndexFile = path.join(__dirname, 'index.json');
const genIndex = jsonfile.readFileSync(genIndexFile);

// Pull calendar id from index
const calendarId = genIndex.calendarId;

const calendar = index.CALENDAR;

// Parse out title and date from provided arguments
const title = program.args[0];
const dateTime = validator.toDate(program.args[1]);

// Optional arguments
const description = program.desc;

// Check for valid inputs
if(!title || !dateTime) {
    console.log('  Must provide title and valid date:time as arguments.\n' +
            '    - Example: `hw add "Math 151 Lab 2" "12/12/23 5:00 pm"`\n' +
            '    - Refer to `hw add --help`');
    process.exit(0);
}

authGoogle(index.GOOGLE_AUTH, function(err, token) {
    oauth2Client.setCredentials({
        access_token: token.access_token,
        refresh_token: token.refresh_token
    });

    gcal.events.insert({
        auth: oauth2Client,
        calendarId: calendarId,
        resource: {
            summary: title,
            start: { dateTime: dateTime },
            end: { dateTime: dateTime },
            description: description ? description : ''
        }
    }, function(err, event) {
        if(err || !event) {
            console.log('  Homework-CLI: Failed to add assignment to calendar!');
            process.exit(0);
        }

        console.log('  Homework-CLI: Added assignment to calendar!');
    });
});