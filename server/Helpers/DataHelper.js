/**
 * @author Alex Ratman
 */

import DbRecordEntity from '../Entities/DbRecordEntity.js';

/**
 * @param {Object} accumulator - data accumulator
 * @param {Object} level - particular data tree branch/level
 * @param {string|boolean} ancestor - current level parent
 * @returns {Object} accumulated data
 *
 * @todo if data structure will be changed this traversing approach should be change accordingly
 */
const traverse = (accumulator, level, ancestor = false) => {
    for (let { $, synset } of level) {
        const {
          gloss,
          wnid,
          words,
        } = $;

        const descendants = synset ? synset.map(element => element.$.wnid) : false;
        const element = accumulator.get(wnid);

        if (!element) {
            accumulator.set(wnid, {
                ancestors: ancestor ? new Set([ancestor]) : new Set(),
                descendants: descendants ? new Set([descendants]) : new Set(),
                gloss,
                wnid,
                words,
            });
        } else {
            const isNewChain = !element.ancestors.has(ancestor) && descendants;

            accumulator.set(wnid, {
                ...element,
                ancestors: ancestor ? element.ancestors.add(ancestor) : element.ancestors,
                descendants: isNewChain ? element.descendants.add(descendants) : element.descendants
            });
        }

        if (synset) traverse(accumulator, synset, wnid);
    }

    return accumulator;
}

/**
 * @param {Object} data - data to write
 * @param {string} html - html template
 * @returns {string} html updated
 */
const fillTemplate = ({ data, html }) =>
    html.replace('@{data}', JSON.stringify(data));

/**
 * @param {Object} json - data to be flatten
 * @returns {Object} flatten json
 */
const flattenJson = json => {
    const accumulator = new Map();
    const initLevel = json[Object.keys(json)[0]].synset // process data only, we don't need root info

    const items = traverse(accumulator, initLevel);

    return [...items].map(([ wnid, data ]) => {
        const record = new DbRecordEntity({ wnid, ...data });
        return record.getDbRecordStructure();
    });
}

export {
    fillTemplate,
    flattenJson,
};
