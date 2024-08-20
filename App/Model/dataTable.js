// May need this later: const sql = require('../App/Util/SqlServer.js');

const sql = require('msnodesqlv8');

/**
 * Class representing a data table.
 * @class
 */
class DataTable {
    constructor(query = '', params = []) {
        this.connectionString = process.env.DB_CONNECTION;
        this.query = query;
        this.params = params;
    }

    executeQuery(query, params = [], callback) {
        sql.query(this.connectionString, query, params, (err, rows) => {
            if (err) {
                console.error('SQL error:', err);
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    }

    getColumns(callback) {
        const baseQuery = 'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ?';
        this.executeQuery(baseQuery, [this.tableName], (err, rows) => {
            if (err) return callback(err, null);
            callback(null, rows);
        });
    }

    getJSON(req, callback) {
        const baseQuery = 'SELECT * FROM your_table'; // Replace with your actual base query
        let query = baseQuery;
        let params = [...this.params];
        const requestParams = req.query;

        // Construct the WHERE clause
        if (requestParams?.search?.value) {
            let whereClauses = params.map((_, index) => `column${index + 1} LIKE ?`).join(' OR ');
            query += ` WHERE ${whereClauses}`;
            params.push(...Array(params.length).fill(`%${requestParams.search.value}%`));
        }

        // Add ORDER BY clause
        if (requestParams.order && requestParams.order.length > 0) {
            const column = requestParams.order[0].column;
            const dir = requestParams.order[0].dir.toUpperCase();
            query += ` ORDER BY column${column + 1} ${dir}`;
        }

        // Add OFFSET and FETCH for pagination
        if (requestParams.start && requestParams.length) {
            query += ` OFFSET ${requestParams.start} ROWS FETCH NEXT ${requestParams.length} ROWS ONLY`;
        }

        // Count total records
        this.executeQuery(`SELECT COUNT(*) as num FROM (${baseQuery}) as tb`, [], (err, countResult) => {
            if (err) return callback(err, null);

            const recordsTotal = countResult[0].num;
            const recordsFiltered = recordsTotal; // Assume no filtering initially

            // Fetch records
            this.executeQuery(query, params, (err, records) => {
                if (err) return callback(err, null);

                const response = {
                    draw: parseInt(requestParams.draw) || 0,
                    recordsTotal: recordsTotal,
                    recordsFiltered: recordsFiltered,
                    data: records
                };

                if (requestParams?.search?.value) {
                    response.recordsFiltered = records.length;
                }

                callback(null, response);
            });
        });
    }
}

module.exports = DataTable;
