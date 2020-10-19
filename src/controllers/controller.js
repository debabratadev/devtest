const con = require('../db/mysql');
const axios = require('axios');

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
            console.log("1 record inserted");
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

module.exports = { getUsers };
