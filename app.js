const express = require('express');
const router = require('./src/routes/router')

const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home', {title: "Great"});
});

app.use('/api/',router);

require('./src/db/mysql');

module.exports = app