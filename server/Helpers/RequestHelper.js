/**
 * @author Alex Ratman
 */

import https from 'http';

/**
 * @param {Object} options - request options
 * @param {*} data
 * @returns {Promise}
 */
const httpsRequest = (options, data) => 
    new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }

            let body = [];

            res.on('data', chunk => {
                body.push(chunk);
            });

            res.on('end', () => {
                try {
                    body = Buffer.concat(body).toString();
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });

        req.on('error', err => {
            reject(err);
        });

        if (data) {
            req.write(data);
        }

        req.end();
    });

export default httpsRequest;
