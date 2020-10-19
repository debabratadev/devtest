const express = require('express');
const router = require('./src/routes/router')



const app = express();

app.get('/', (req, res) => {
    res.send('Hello Worlds!')
});

app.use('/api/',router);

require('./src/db/mysql');

module.exports = app