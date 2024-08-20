'use strict';

let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/db-test', async function (req, res) {
    const SqlServer = require('../App/Util/SqlServer.js');
    const db = new SqlServer(process.env.DB_CONNECTION);
    const sqlStr = 'SELECT count(*) as count FROM cohauth.dbo.user_account';
        // `SELECT a.account, a.uid, a.last_login, a.last_logout, a.last_ip
        // FROM cohauth.dbo.user_account a
        // INNER JOIN cohauth.dbo.user_auth b ON a.account = b.account WHERE a.uid = 1`;

    let data;
    try {
        // Execute a query
        const result = await db.query(sqlStr);
        console.log(result);
        data = result;
    } catch (error) {
        console.error('Error:', error);
    }

    res.render('db-test', { title: 'DB Test', db_content: JSON.stringify(data) });

});

module.exports = router;