const sql = require('msnodesqlv8');
const { URLSearchParams } = require('url');

class DataTable {
    constructor(query = '', params = []) {
        this.connectionString = process.env.DB_CONNECTION; // Ensure this environment variable is set
        this.query = query;
        this.params = params;
    }

    executeQuery(query, params, callback) {
        sql.query(this.connectionString, query, params, (err, rows) => {
            if (err) {
                console.error('SQL error:', err);
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    }

    async getColumns(tableName, callback) {
        const query = 'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ?';
        this.executeQuery(query, [tableName], (err, rows) => {
            if (err) return callback(err, null);
            callback(null, rows);
        });
    }

    async getJSON(req, callback) {
        const urlParams = new URLSearchParams(req.query);
        const searchValue = urlParams.get('search[value]') || '';
        const orderColumn = urlParams.get('order[0][column]') || 0;
        const orderDir = urlParams.get('order[0][dir]') || 'asc';
        const start = parseInt(urlParams.get('start'), 10) || 0;
        const length = parseInt(urlParams.get('length'), 10) || 10;

        let params = [...this.params];
        let query = this.query;

        // Construct WHERE clause
        if (searchValue) {
            const whereClauses = [];
            this.query.split('FROM')[1].split('WHERE')[0].split(',').forEach((column, index) => {
                whereClauses.push(`${column.trim()} LIKE ?`);
                params.push(`%${searchValue}%`);
            });
            query += ' WHERE ' + whereClauses.join(' OR ');
        }

        // Add ORDER BY clause
        query += ` ORDER BY ${orderColumn + 1} ${orderDir.toUpperCase()}`;

        // Add OFFSET and FETCH for pagination
        query += ` OFFSET ${start} ROWS FETCH NEXT ${length} ROWS ONLY`;

        // Count total records
        const countQuery = `SELECT COUNT(*) as num FROM (${this.query}) as tb`;
        this.executeQuery(countQuery, this.params, (err, countResult) => {
            if (err) return callback(err, null);

            const recordsTotal = countResult[0].num;
            let recordsFiltered = recordsTotal;

            // Fetch records
            this.executeQuery(query, params, (err, records) => {
                if (err) return callback(err, null);

                if (searchValue) {
                    recordsFiltered = records.length;
                }

                callback(null, {
                    draw: parseInt(urlParams.get('draw'), 10) || 0,
                    recordsTotal: recordsTotal,
                    recordsFiltered: recordsFiltered,
                    data: records
                });
            });
        });
    }
}

module.exports = DataTable;
