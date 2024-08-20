const axios = require('axios');

class Http {
    /**
     * Perform a GET request.
     *
     * @param {string} url The URL to request.
     * @returns {Promise<string>} The response body.
     * @throws {Error} Throws an error if the request fails.
     */
    static async get(url) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'cohportal',
                },
                httpsAgent: new (require('https')).Agent({
                    rejectUnauthorized: false // Equivalent to CURLOPT_SSL_VERIFYPEER and CURLOPT_SSL_VERIFYHOST = false
                })
            });

            if (response.status !== 200) {
                throw new Error(`An error was encountered when attempting to retrieve ${url}\nHTTP status code: ${response.status}`);
            }

            return response.data;
        } catch (error) {
            throw new Error(`An error occurred during the GET request: ${error.message}`);
        }
    }

    /**
     * Perform a POST request.
     *
     * @param {string} url The URL to request.
     * @param {object} [args={}] The data to send with the POST request.
     * @returns {Promise<string>} The response body.
     * @throws {Error} Throws an error if the request fails.
     */
    static async post(url, args = {}) {
        try {
            const response = await axios.post(url, args, {
                headers: {
                    'User-Agent': 'cohportal',
                },
                httpsAgent: new (require('https')).Agent({
                    rejectUnauthorized: false // Equivalent to CURLOPT_SSL_VERIFYPEER and CURLOPT_SSL_VERIFYHOST = false
                })
            });

            if (response.status !== 200) {
                throw new Error(`Error from remote site\n${JSON.stringify(response.data, null, 2)}`);
            }

            return response.data;
        } catch (error) {
            throw new Error(`An error occurred during the POST request: ${error.message}`);
        }
    }
}

module.exports = Http;
