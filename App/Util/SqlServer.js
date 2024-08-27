'use strict';
const sql = require('msnodesqlv8');

class SqlServer {
    constructor(connectionString) {
        this.connectionString = connectionString;
    }


    // Function to create a connection
    async getConnection() {
        return new Promise((resolve, reject) => {
            sql.open(this.connectionString, (err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });
    }

    // Execute a query
    async query(queryString, params = []) {
        const connection = await this.getConnection();

        return new Promise((resolve, reject) => {
            connection.query(queryString, params, (err, result) => {
                connection.close(); // Always close the connection when done
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    dbquery(query) {
        let data;
        sql.open(this.connectionString, function (err, con) {
            if (err) {
                console.log(`failed to open ${err.message}`);
            }
            const d = new Date();
            con.query(query, function (err, rows) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                const elapsed = new Date() - d;
                console.log(`rows.length ${rows.length} elapsed ${elapsed}`);
                console.log(`${JSON.stringify(rows, null, 4)}`);
            });
        });
        return data;
    }

    async fetchNumeric(query, params, callback) {
        await this.query(query, params, (err, rows) => {
            if (err) {
                return callback(err, null);
            }
            // Assuming rows are returned as an array of arrays
            callback(null, rows);
        });
    }
}

module.exports = SqlServer;