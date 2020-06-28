/**
 * @author Alex Ratman
 */

import xml2js from 'xml2js';

const parser = new xml2js.Parser();

/**
 * @param {string} data
 * @returns {Promise} representing JSON data structure
 */
const xmlParser = async data => parser.parseStringPromise(data);

export default xmlParser;
