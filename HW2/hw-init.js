const program = require('commander');

const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const inquirer = require('inquirer');
const authGoogle = require('auth-google');

const google = require('googleapis');
const gcal = google.calendar('v3');

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2();

const index = require('./index.js');

program
    .version(index.VERSION)
    .usage('[options]')
    .parse(process.argv);

//Create a new index file (index.json)

const homePath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

const indexFile = path.join(__dirname, '../', 'index.json');
const tokenFile = path.join(homePath, '.index', index.CLIENT_NAME, 'token.json');

// Index file object
const indexObj = {};

// If index file already exists, confirm overwrite
if(fs.existsSync(indexFile) || fs.existsSync(tokenFile)) {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'toOverwrite',
            message: 'Are you sure you want to overwrite your index file(s)?',
            default: true
        }
    ], function (answers) {
        if(answers.toOverwrite) {
            // Remove files
            if(fs.existsSync(indexFile))
                fs.unlinkSync(indexFile);
            if(fs.existsSync(tokenFile))
                fs.unlinkSync(tokenFile);

            createCalendar();
        } else {
            process.exit(0);
        }
    });
} else {
    createCalendar();
}

function writeIndexFile(indexObj) {
    // Write to file
    jsonfile.writeFileSync(indexFile, indexObj);
}

function readIndexFile() {
    // Read from file
    return jsonfile.readFileSync(indexFile);
}

function createCalendar() {
    authGoogle(index.GOOGLE_AUTH, function(error, token) {
        oauth2Client.setCredentials({
            access_token: token.access_token,
            refresh_token: token.refresh_token
        });

        // Check to see if calendar exists, and user is owner
        gcal.calendarList.list({
            auth: oauth2Client
        }, function (err, calendarList) {
            // See if calendar list contains our calendar
            const result = calendarList.items.filter(function (item) {
                if (item.accessRole === index.CALENDAR.accessRole) {
                    return item.summary == index.CALENDAR.summary;
                }
            });

            if (result.length > 0) {
                // If calendar exists already, store id of calendar in index file
                const calendarId = result[0].id;
                indexObj.calendarId = calendarId;

                // Create index file
                writeIndexFile(indexObj);

                console.log('  Homework-CLI: Finished initializing the CLI!');
                process.exit(0);
            } else {
                // Otherwise, create a new calendar
                gcal.calendars.insert({
                    auth: oauth2Client,
                    resource: {
                        summary: index.CALENDAR.summary
                    }
                }, function (err, calendarEntry) {
                    // Now store id of new calendar in index file
                    const calendarId = calendarEntry.id;
                    indexObj.calendarId = calendarId;

                    // Create index file
                    writeIndexFile(indexObj);

                    console.log('  Homework-CLI: Finished initializing the CLI!');
                    process.exit(0);
                });
            }
        });
    });
}