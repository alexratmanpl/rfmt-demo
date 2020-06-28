/**
 * @author Alex Ratman
 */

import { flattenJson } from '../Helpers/DataHelper.js';
import httpsRequest from '../Helpers/RequestHelper.js';
import xmlParser from '../Helpers/ParserHelper.js';

class DataService {
    /**
     * @param {Object} options - request options
     * @returns {Promise} representing xml data
     */
    async getDataFromUrl(options) {
        try {
            return httpsRequest(options);
        } catch (e) {
            throw new Error(e);
        }
    }

    /**
     * @param {string} xml
     * @returns {Promise} representing JSON data structure
     */
    async parseXmlToJson(xml) {
        try {
            const json = await xmlParser(xml);
            return flattenJson(json);
        } catch (e) {
            throw new Error(e);
        }
    }
}

export default DataService;
