const index = {};

index.CLIENT_NAME = 'Homework-CLI';

index.CLIENT_ID = '235566101309-dcj2g6cuk0kue8j67o8rq0eugv4r0bvt.apps.googleusercontent.com';
index.CLIENT_SECRET = '71vWPWs7dc1_08wjaH4ibKN3';

index.GOOGLE_AUTH = {
    name: index.CLIENT_NAME,
    client_id: index.CLIENT_ID,
    client_secret: index.CLIENT_SECRET,
    scope: ['https://www.googleapis.com/auth/calendar']
};

index.VERSION = '1.0.3';
index.CALENDAR = {
    summary: 'Homework-CLI',
    accessRole: 'owner'
};

module.exports = index;