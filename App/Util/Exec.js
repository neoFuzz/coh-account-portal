const { exec } = require('child_process');

class Exec {
    /**
     * Execute a command and return its output. Either wait until the command exits or the timeout has expired.
     * 
     * @param {string} cmd Command to execute
     * @param {number} timeout Timeout in seconds
     * 
     * @returns {Promise<string>} Output of the command
     * 
     * @throws {Error} Throws an error if the command fails or times out
     */
    static async exec(cmd, timeout) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                process.kill(-process.pid); // Kill the child process tree
                reject(new Error('Command timed out'));
            }, timeout * 1000);

            exec(cmd, { timeout: timeout * 1000 }, (error, stdout, stderr) => {
                clearTimeout(timer);

                if (error) {
                    reject(new Error(stderr || 'Command failed'));
                } else {
                    resolve(stdout);
                }
            });
        });
    }
}

module.exports = Exec;
