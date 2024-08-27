const sql = require('msnodesqlv8');
const { URLSearchParams } = require('url');

/**
 * DataTable class to handle server-side processing for DataTables
 *
 * @class DataTable
 */
class DataTable {
    /**
     * Creates an instance of DataTable.
     *
    * @param {string} [query=''] - The SQL query string to be executed. Defaults to an empty string.
    * @param {Array} [params=[]] - An array of parameters to be used with the SQL query. Defaults to an empty array.
    */
    constructor(query = '', params = []) {
        this.connectionString = process.env.DB_CONNECTION;
        this.query = query;
        this.params = params;
    }

    /**
     * Execute a SQL query with parameters
     *
     * @param {string} query 
     * @param {Array} params 
     * @param {Function} callback 
     */
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

    /**
     * Retrieves the column names for a specified table.
     * 
     * @param {string} tableName - The name of the table whose columns are to be retrieved.
     * @param {function(Error, Array<Object>):void} callback - A callback function that is called with the results. 
     *   The first parameter is an error object (or `null` if no error occurred), and the second parameter is an array of row objects representing the column names.
     * 
     * @returns {void} This method does not return a value; instead, it uses the callback function to return results or errors.
     */
    async getColumns(tableName, callback) {
        const query = 'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ?';
        this.executeQuery(query, [tableName], (err, rows) => {
            if (err) return callback(err, null);
            callback(null, rows);
        });
    }

    /**
     * Handles a request to retrieve JSON data with support for pagination, searching, and sorting.
     * 
     * @param {Object} req - The request object containing query parameters for filtering, sorting, and pagination.
     * @param {function(Error, Object):void} callback - A callback function that is called with the results.
     *   - The first parameter is an error object (or `null` if no error occurred).
     *   - The second parameter is an object containing:
     *     - `draw` {number} - The draw counter for client-side processing.
     *     - `recordsTotal` {number} - The total number of records without filtering.
     *     - `recordsFiltered` {number} - The number of records after applying the search filter.
     *     - `data` {Array<Object>} - An array of objects representing the queried records.
     * 
     * @returns {void} This method does not return a value; instead, it uses the callback function to return results or errors.
     */
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
