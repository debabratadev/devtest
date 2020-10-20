const con = require('../db/mysql');
const axios = require('axios');
const puppeteer = require('puppeteer');

const getUsers = async (req, res) => {
    try {
        const page1 = await fetchUsers(1);
        const page2 = await fetchUsers(2);

        const usersData = [...page1.data, ...page2.data];

        let users = [];

        usersData.forEach((user) => {
            users.push(`('${user.first_name}', '${user.last_name}', '${user.email}', '${user.avatar}')`);
        });

        const values = users.join(', ');

        var sql = "INSERT INTO users (first_name, last_name, email, avatar) VALUES " + values;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("inserted");
        });

        res.status(200).send({
            status: 200,
            data: {
                data: values
            }
        });

    }
    catch (e) {
        console.log(e)
        res.status(400).send({ error: e });
    }

}

const fetchUsers = async (page) => {
    const resp = await axios.get(`https://reqres.in/api/users?page=${page}`);

    return resp.data;
}

const fetchDataFromWebsite = async (req, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://develop.pub.afflu.net');

        await page.type('body > div.content > form.login-form > div:nth-child(2) > input', 'developertest@affluent.io');
        await page.type('body > div.content > form.login-form > div:nth-child(3) > input', 'SOpcR^37');

        await Promise.all([
            await page.click('body > div.content > form.login-form > div.form-actions > button'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);

        // await page.screenshot({ path: 'example.png' });

        await browser.close();

        res.status(200).send({
            status: 200,
            message: 'Login Success'
        });
    }
    catch (e) {
        console.log(e)
        res.status(400).send({ error: e });
    }

}

module.exports = { getUsers, fetchDataFromWebsite };
