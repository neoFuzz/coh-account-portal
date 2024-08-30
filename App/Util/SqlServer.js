'use strict';
const sql = require('msnodesqlv8');

/**
 * Class representing a SQL Server connection.
 * @class
 */
class SqlServer {
    /**
     * Create a SQL Server connection.
     * @constructor
     * @param {string} connectionString 
     */
    constructor(connectionString) {
        this.connectionString = connectionString;
    }


    /**
     *  Function to create an SQL Server connection.
     *  @returns {Promise} A promise that resolves with the connection object or rejects with an error.
     */
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

    /**
     * Function to execute a SQL query.
     * @async
     * @param {string} queryString 
     * @param {Array} params 
     * @returns 
     */
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

    /**
     * Simplified function to execute a SQL query.
     * 
     * @param {string} query The SQL query to execute.
     * @returns {Object} The result of the query.
     */
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

    /**
     * Fetch numeric data from the database.
     * @async
     * @param {string} query The SQL query to execute. 
     * @param {Array} params The parameters for the query.
     * @param {Function} callback The callback function to handle the result.
     */
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