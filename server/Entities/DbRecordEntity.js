/**
 * @author Alex Ratman
 */

class DbRecordEntity {
    #countDescendants = descendants =>
      descendants ? [...descendants].map(descendant => descendant.length) : [];

    /**
     * @param {Set|Array} ancestors
     * @param {Set|Array} descendants
     * @param {string} gloss
     * @param {*} size
     * @param {string} wnid
     * @param {string} words
     */
    constructor({
        ancestors,
        descendants,
        gloss,
        size,
        wnid,
        words,
    }) {
        this.state = {
            descendants: Array.isArray(descendants) ? descendants : [...descendants],
            gloss,
            ancestors: Array.isArray(ancestors) ? ancestors : [...ancestors],
            size: Array.isArray(size) ? size : this.#countDescendants(descendants),
            wnid,
            words
        }
    }

    /**
     * @param {number} index - children array index
     * @returns {Array}
     */
    getDescendants(index = 0) {
        return this.state.descendants[index];
    }

    /**
     * @param {number} index - parent index
     * @param {number} limit - results limit
     * @param {number} start - limit start index
     * @returns {Array}
     */
    getDescendantsLimited({ limit, index, start = 0 }) {
        const available = this.state.descendants.length ? this.state.descendants[index] : [];
        return available.slice(start, start + limit);
    }

    /**
     * @param {number} ancestor
     * @returns {Array|number}
     */
    getDescendantsIndex(ancestor) {
      return ancestor ? this.state.ancestors.indexOf(ancestor) : 0;
    }

    /**
     * @returns {Object}
     */
    getDbRecordStructure() {
        return this.state;
    }

    /**
     * @returns {string}
     */
    getWnid() {
        return this.state.wnid;
    }
}

export default DbRecordEntity;
