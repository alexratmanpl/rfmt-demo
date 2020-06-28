/**
 * @author Alex Ratman
 */

import { default as mongodb } from 'mongodb';
import { db } from '../config.js';

const { collection, name, url } = db;

class DbConnector {
    constructor() {
        this.client = new mongodb.MongoClient(url, { useUnifiedTopology: true });
        this.db = null;
    }

    /**
     * @returns {Promise} representing connection close success
     */
    async close() {
        try {
            await this.client.close();
        } catch (e) {
            throw new Error(e);
        }
    }

    /**
     * @param {boolean} init - whether init processes defined in .init() should be trigerred
     * @returns {Promise} representing connection open success
     */
    async connect(init = true) {
        try {
            await this.client.connect();
            this.db = this.client.db(name);
            if (init) await this.init();
        } catch (e) {
            throw new Error(e);
        }
    }

    /**
     * @param {Object} query - cursor query object
     * @param {Object} options - optional settings
     * @returns {Promise} representing results of the operation
     */
    async find(query = {}, options = { projection: { _id: 0 }}) {
        try {
            const cursor = await this.db.collection(collection).find(query, options);
            return cursor.toArray();
        } catch (e) {
            throw new Error(e);
        }
    }

    /**
     * @param {Object} query - cursor query object
     * @param {Object} options - optional settings
     * @returns {Promise} representing results of the operation
     */
    async findOne(query = {}, options = { projection: { _id: 0 }}) {
        try {
            return this.db.collection(collection).findOne(query, options);
        } catch (e) {
            throw new Error(e);
        }
    }

    /**
     * @returns {Promise} representing init operation(s) success
     */
    async init() {
        try {
            await this.db.collection(collection).createIndex({ gloss: 'text', words: 'text' });
            await this.db.collection(collection).createIndex({ size: 1 });
        } catch (e) {
            throw new Error(e);
        }
    }

    /**
     * @param {Object} data - data to update
     * @returns {Promise} representing results of the operation
     */
    async insertMany(data = {}) {
        try {
            return this.db.collection(collection).insertMany(data);
        } catch (e) {
            throw new Error(e);
        }
    }
}

export default new DbConnector();
