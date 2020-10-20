const con = require('../db/mysql');
const axios = require('axios');
const puppeteer = require('puppeteer');
const { PendingXHR } = require('pending-xhr-puppeteer');

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
        const browser = await puppeteer.launch({
            headless: false,
            slowMo: 20 // slow down by 250ms
        });
        const page = await browser.newPage();
        const pendingXHR = new PendingXHR(page);

        await page.goto('https://develop.pub.afflu.net', {
            waitUntil: 'networkidle0',
        });

        // Login
        await page.type('body > div.content > form.login-form > div:nth-child(2) > input', 'developertest@affluent.io');
        await page.type('body > div.content > form.login-form > div:nth-child(3) > input', 'SOpcR^37');
        await Promise.all([
            await page.click('body > div.content > form.login-form > div.form-actions > button'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);

        await page.goto('https://develop.pub.afflu.net/list?type=dates&startDate=2020-04-01&endDate=2020-04-30', {
            waitUntil: 'networkidle0',
        });

        // await page.screenshot({ path: 'example.png' });

        const nextButton = '#DataTables_Table_0_wrapper div.dataTables_paginate > ul.pagination a[title="Next"]';
        
        // Fetch from table
        const records = [];
        for (let index = 0; index < 6; index++) {
            if(index !== 0) {
                await page.click(nextButton);
                await pendingXHR.waitForAllXhrFinished();
                await page.waitFor(1000);
            }

            let chunks = await page.evaluate(() => {
                const tds = Array.from(document.querySelectorAll('#DataTables_Table_0 tr td'))
                return tds.map(td => td.innerText)
            });

            while(chunks.length) records.push(chunks.splice(0,8));
        }
        
        let conRecords = [];

        // Make data insertable into table
        records.forEach(record => {

            let conRecord = [];

            record.forEach((single) => {
                conRecord.push(`'${single}'`);
            });

            conRecords.push(` ( ${conRecord.join(', ')} )`);
        });

        const values = conRecords.join(', ');

        // Insert into table
        var sql = "INSERT INTO dates (date, commisions, sales, leads, clicks, epc, impressions, cr) VALUES " + values;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("inserted");
        });

        await browser.close();

        res.status(200).send({
            status: 200,
            message: 'Success'
        });
    }
    catch (e) {
        console.log(e)
        res.status(400).send({ error: e });
    }

}

module.exports = { getUsers, fetchDataFromWebsite };
