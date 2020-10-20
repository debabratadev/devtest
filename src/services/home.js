const con = require('../db/mysql');

async function fetchUsers() {
    try {
        return new Promise((resolve, reject) => {

            con.query("SELECT * FROM users", function (err, result, fields) {
                if (err) throw err;
                resolve(result);
                return result;
            });
        });

        
    }
    catch (e) {
        console.log(e)
        res.status(400).send({ error: e });
    }

}

async function fetchDates() {
    try {
        return new Promise((resolve, reject) => {

            con.query("SELECT * FROM dates", function (err, result, fields) {
                if (err) throw err;
                resolve(result);
                return result;
            });
        });

        
    }
    catch (e) {
        console.log(e)
        res.status(400).send({ error: e });
    }

}

module.exports = { fetchUsers, fetchDates };
