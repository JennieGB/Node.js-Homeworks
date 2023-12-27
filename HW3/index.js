const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('static'));

const visitsFilePath = path.join(__dirname, 'visits.json');

let visits = {
    home: 0,
    about: 0
};

if (fs.existsSync(visitsFilePath)) {
    visits = JSON.parse(fs.readFileSync(visitsFilePath, 'utf-8'));
}

app.use((req, res, next) => {
    if (req.path === '/') {
        visits.home++;
    } else if (req.path === '/about') {
        visits.about++;
    }
    fs.writeFileSync(visitsFilePath, JSON.stringify(visits));
    next();
});

app.get('/', (req, res) => {
    res.render('index', { visits: visits.home });
});

app.get('/about', (req, res) => {
    res.render('about', { visits: visits.about });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

