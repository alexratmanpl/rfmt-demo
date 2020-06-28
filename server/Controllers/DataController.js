/**
 * @author Alex Ratman
 */

import DataService from '../Services/DataService.js';

const dataService = new DataService();

class DataController {
    /**
     * @param {Object} options - request options
     * @returns {Promise} representing JSON data structure
     */
    async fetchDataAction(options) {
        try {
            const xml = await dataService.getDataFromUrl(options);
            return dataService.parseXmlToJson(xml);
        } catch (e) {
            throw new Error(e);
        }
    }
}

export default DataController;
