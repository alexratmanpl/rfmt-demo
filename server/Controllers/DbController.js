/**
 * @author Alex Ratman
 */

import DbRecordEntity from '../Entities/DbRecordEntity.js';
import dbConnector from '../DbConnector/DbConnector.js';

class DbController {
    /**
     * @returns {Promise} representing connection close success
     */
    async closeDbAction() {
        try {
            return dbConnector.close();
        } catch (e) {
            throw new Error(e);
        }
    }

    /**
     * @returns {Promise} representing connection open success
     */
    async connectDbAction() {
        try {
            return dbConnector.connect();
        } catch (e) {
            throw new Error(e);
        }
    }

    /**
     * @param {string} ancestor - element parent wnid
     * @param {number} limit - results limit
     * @param {number} start - limit start index
     * @param {string} wnid
     * @returns {Promise} representing searching operation results
     */
    async getDbElementAndDescendantsAction({
        ancestor = '',
        limit = 50,
        start = 0,
        wnid = '',
    }) {
        let element = false;
        let descendants = false;
        let root = false;

        if (wnid) {
            try {
                element = await dbConnector.findOne({ wnid });

                if (element) {
                    const record = new DbRecordEntity(element);
                    const index = record.getDescendantsIndex(ancestor);
                    const limited = record.getDescendantsLimited({ index, limit, start });

                    descendants = limited.length ?
                        await dbConnector.find({
                            wnid: { $in: limited }
                        }) : [];
                }
            } catch (e) {
              throw new Error(e);
            }
        } else {
            try {
                element = await dbConnector.findOne({ ancestors: { $size: 0 } });
                const record = new DbRecordEntity(element);
                descendants = await dbConnector.find({ wnid: { $in: record.getDescendants() } });
                root = record.getWnid();
            } catch (e) {
                throw new Error(e);
            }
        }

        const results = {
            ancestor,
            descendants,
            element,
        };

        return root ? {...results, root} : results;
    }

    /**
     * @param {Array} wnids - children wnids
     * @returns {Promise} representing searching operation results
     */
    async getDbElementsChildrenAction({ wnids = [] }) {
        let descendants;

        try {
            descendants = wnids.length ?
                await dbConnector.find({
                    wnid: { $in: wnids }
                }) : [];
        } catch (e) {
            throw new Error(e);
        }

        return { descendants };
    }

    /**
     * @param {string} ancestor - parent wnid
     * @param {number} limit - results limit
     * @param {string} wnid - element wnid
     * @returns {Promise} representing searching operation results
     */
    async getDbElementsLargestChildrenAction({
        ancestor = '',
        limit = 50,
        wnid = '',
    }) {
        let largest = false;

        if (wnid) {
            try {
                const element = await dbConnector.findOne({ wnid });

                if (element) {
                    const record = new DbRecordEntity(element);
                    const index = record.getDescendantsIndex(ancestor);
                    const limited = record.getDescendantsLimited({ index, limit, ancestor });

                    largest = limited.length ?
                        await dbConnector
                            .find({
                                wnid: { $in: limited }
                            }, {
                                projection: { _id: 0 },
                                sort: { [`size.${index}`]: -1 },
                                limit
                            }) : [];
                }
            } catch (e) {
              throw new Error(e);
            }
        } else {
            try {
                const element = await dbConnector.findOne({ ancestors: { $size: 0 } });
                const record = new DbRecordEntity(element);

                largest = await dbConnector
                    .find({
                        wnid: { $in: record.getDescendants() }
                    }, {
                        projection: { _id: 0 },
                        sort: { 'size.0': -1 },
                        limit
                    });
            } catch (e) {
              throw new Error(e);
            }
        }

        return { largest };
    }

    /**
     * @param {string} query - query string
     * @param {number} limit - results limit
     * @returns {Promise} representing searching operation results
     */
    async searchDbAction({ query, limit = 10 }) {
        let elements = false;
        let ancestors = false;

        if (query) {
            try {
                elements = await dbConnector.find(
                    { $or:
                        [
                            { words: { '$regex': query, '$options': 'i' } },
                            { gloss: { '$regex': query, '$options': 'i' } }
                        ]
                    },
                  {
                        limit,
                        projection: { _id: 0 }
                    }
                );
                const wnids = elements.length ? elements.map(child => [...child.ancestors]).flat(2) : [];
                ancestors = wnids.length ?
                    await dbConnector.find({
                        wnid: { $in: wnids }
                    }) : [];
            } catch (e) {
                throw new Error(e);
            }
        }

        return { ancestors, elements };
    }

    /**
     * @param {Object} data - data to update
     * @returns {Promise} representing operation success state
     */
    async updateDbAction(data) {
        try {
            return dbConnector.insertMany(data);
        } catch (e) {
            throw new Error(e);
        }
    }
}

export default DbController;
