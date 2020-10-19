const express = require('express');
const router = require('./src/routes/router');
const home = require('./src/services/home');

const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    (async function() {
        const result = await home.fetchUsers();
        
        console.log(result);
        res.render('home', {users:result});
    })();
});

app.use(express.static(__dirname));
app.use('/api/',router);

require('./src/db/mysql');

module.exports = app