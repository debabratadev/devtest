const express = require('express');
const router = require('./src/routes/router');
const home = require('./src/services/home');

const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    (async function () {
        const users = await home.fetchUsers();
        const dates = await home.fetchDates();
        res.render('home', { users: users, dates: dates });
    })();
});

app.use(express.static(__dirname));
app.use('/api/', router);

require('./src/db/mysql');

module.exports = app