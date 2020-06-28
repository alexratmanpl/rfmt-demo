/**
 * @author Alex Ratman
 */

import type {
    ApiResponse,
    CategoriesProps,
    CreateBreadcrumbs,
    GraphProps,
    Element,
    MenuProps,
    MonitorProps,
    NavigationProps,
    SearchResultsProps,
    SunburstPoint,
} from "../../types/ClientTypes";

/**
 * @param {Object} prevProps
 * @param {Object} nextProps
 * @returns {boolean} areEqual
 */
const areCategoriesPropsEqual = (prevProps: CategoriesProps, nextProps: CategoriesProps): boolean =>
    !haveItemsChanged(prevProps.list, nextProps.list);

/**
 * @param {Object} prevProps
 * @param {Object} nextProps
 * @returns {boolean} areEqual
 */
const areGraphPropsEqual = (prevProps: GraphProps, nextProps: GraphProps): boolean =>
    !haveItemsChanged(prevProps.largest, nextProps.largest);

/**
 * @param {Object} prevProps
 * @param {Object} nextProps
 * @returns {boolean} areEqual
 */
const areMenuPropsEqual = (prevProps: MenuProps, nextProps: MenuProps): boolean => {
    const ancestorsChanged = !haveItemsChanged(prevProps.ancestors, nextProps.ancestors);
    const listChanged = !haveItemsChanged(prevProps.list, nextProps.list);
    const searchFieldActivityChanged = prevProps.isSearchFieldActive === nextProps.isSearchFieldActive;
    const searchFieldValueChanged = prevProps.searchFieldValue === nextProps.searchFieldValue;

    return ancestorsChanged && listChanged && searchFieldActivityChanged && searchFieldValueChanged;
};

/**
 * @param {Object} prevProps
 * @param {Object} nextProps
 * @returns {boolean} areEqual
 */
const areMonitorPropsEqual = (prevProps: MonitorProps, nextProps: MonitorProps): boolean => {
    const headerChanged = prevProps.header === nextProps.header;
    const selectedChanged = prevProps.selected === nextProps.selected;
    const sizeChanged = prevProps.size === nextProps.size;

    return headerChanged && selectedChanged && sizeChanged;
};

/**
 * @param {Object} prevProps
 * @param {Object} nextProps
 * @returns {boolean} areEqual
 */
const areNavigationPropsEqual = (prevProps: NavigationProps, nextProps: NavigationProps): boolean =>
    !haveItemsChanged(prevProps.breadcrumbs, nextProps.breadcrumbs);

/**
 * @param {Object} prevProps
 * @param {Object} nextProps
 * @returns {boolean} areEqual
 */
const areSearchResultsPropsEqual = (prevProps: SearchResultsProps, nextProps: SearchResultsProps): boolean => {
    const listChanged = !haveItemsChanged(prevProps.list, nextProps.list);
    const searchFieldActivityChanged = prevProps.isSearchFieldActive === nextProps.isSearchFieldActive;

    return listChanged && searchFieldActivityChanged;
};

/**
 * Graph tree creator
 */
const branchSchema = ({
    descendants,
    wnid,
    words,
}: {
    descendants: Array<any>,
    wnid: string,
    words: string,
}): SunburstPoint => ({
    children: descendants,
    dontRotateLabel: true,
    size: 1,
    title: '',
    wnid,
    words,
});

const leafSchema = ({
    ancestor,
    ancestors,
    index,
    size,
    wnid,
    words,
}: {
    ancestor: string,
    ancestors: Array<string>,
    index: number,
    size: Array<number>,
    wnid: string,
    words: string,
}): object => {
    const position = ancestor ? ancestors.indexOf(ancestor) : 0;
    return {
        ancestor,
        color: index,
        size: size.length ? size[position] * 1000 : 0, // multiplied x 1000 for more precise graph rendering
        title: '',
        wnid,
        words,
    };
};

/**
 * @param {string} ancestor - parent element wnid
 * @param {Array} breadcrumbs
 * @param {boolean} isSearchResult
 * @param {string} root - root element wnid
 * @param {string} wnid - current element wnid
 * @param {string} words - current element category
 * @returns {Array} updated breadcrumbs
 */
const createBreadcrumbs = ({
    ancestor,
    breadcrumbs,
    isSearchResult,
    root,
    wnid,
    words,
}: CreateBreadcrumbs): Array<any> => {
    let newBreadcrumb = {
        ancestor,
        wnid,
        words,
    };
    let index;
    let parentIndex;

    if (!breadcrumbs) return [];
    if (!ancestor && !wnid) return []; // breadcrumbs root click
    if (!ancestor) return breadcrumbs; // graph root click

    for (let i = 0; i < breadcrumbs.length; i++) {
        const breadcrumb = breadcrumbs[i];
        if (!breadcrumb) continue;
        if (breadcrumb.wnid === ancestor) parentIndex = i;
        if (breadcrumb.wnid === wnid) index = i;
    }

    if (!isSearchResult) {
        if (index === undefined) return [...breadcrumbs, newBreadcrumb]; // list or graph item selected, add new item
        const remaining = breadcrumbs.slice(0, index + 1);
        // breadcrumb item selected, move back, remove '...' if this is last element
        return remaining.length === 1 && remaining[0] === null ? [] : remaining;
    }

    // root child has been selected remove '...' and add one new root first level child
    if (ancestor === root) return [newBreadcrumb];

    if (!index) {
        // no parent, some nested element has been selected in search results
        if (parentIndex === undefined) return [null, newBreadcrumb];
        // parent exists, some nested element has been selected in search results
        return [...breadcrumbs.slice(0, parentIndex + 1), newBreadcrumb];
    }

    // some element in present tree has been selected in search results
    return breadcrumbs.slice(0, index + 1);
};

/**
 * @param {Object} element - current element data
 * @param {Array} largest - largest children
 * @returns {Object} Graph data structure
 */
const createGraph = ({
    element,
    largest
}: {
    element: Element,
    largest: Array<any>
}): SunburstPoint => {
    const descendants = largest.map((child, index) =>
        leafSchema({
            ...child,
            index,
            ancestor: element.wnid
        }),
    );
    return branchSchema({ ...element, descendants });
};

/**
 * @param {Object} body
 * @param {string} method
 * @returns {Object} fetch options
 */
const createOptions = ({
    body,
    method = 'POST',
}: {
    body: object,
    method?: string
}): object => ({
    method,
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
});

/**
 * @param {string} path
 * @param {string} query
 * @returns {string} route
 */
const createRouteForSearch = ({
    path,
    query,
}: {
    path: string,
    query: string,
}): string => query ? `${path}?query=${query}` : path;

/**
 * @param {string} ancestor
 * @param {string} path
 * @param {string} wnid
 * @returns {string} route
 */
const createRouteForSpecies = ({
    ancestor,
    path,
    wnid,
}: {
    ancestor?: string,
    path: string,
    wnid?: string,
}): string => {
    let route = path;
    if (wnid) route = `${route}?wnid=${wnid}`;
    if (ancestor) route = `${route}&ancestor=${ancestor}`;
    return route;
};

/**
 * @param {string} domain
 * @param {string} port
 * @param {string} protocol
 * @param {string} route
 * @returns {string} url
 */
const createUrl = ({
    domain,
    port,
    protocol,
    route,
}: {
    domain: string,
    port: number,
    protocol: string,
    route: string,
}): string => `${protocol}://${domain}:${port}/${route}`;

/**
 * @param {Object} options
 * @param {string} url
 * @returns {Promise} representing fetch results
 */
const fetchData = async ({
    options = {},
    url,
}: {
    options?: object,
    url: string,
}): Promise<ApiResponse> => {
    try {
        const response = await fetch(url, options);
        return response.json();
    } catch (e) {
        throw new Error(e);
    }
};

/**
 * @param {string} ancestor - currently selected element's parent wnid
 * @param {Object} element - currently selected element
 * @returns {number} index
 */
const getChainIndex = ({
    ancestor,
    element,
}: {
    ancestor?: string,
    element: Element,
}): number => ancestor ? element.ancestors.indexOf(ancestor) : 0;

/**
 * @param {Array | undefined} prev
 * @param {Array | undefined} next
 * @returns {boolean}
 */
const haveItemsChanged = (prev?: Array<any>, next?: Array<any>): boolean => {
    if (typeof prev === undefined && typeof next === undefined) return false;
    if (prev!.length !== next!.length) return true;
    for (let i = 0; i < prev!.length; i++) {
        if (prev![i] !== next![i]) return true;
    }
    return false;
};

export {
    areCategoriesPropsEqual,
    areGraphPropsEqual,
    areMenuPropsEqual,
    areMonitorPropsEqual,
    areNavigationPropsEqual,
    areSearchResultsPropsEqual,
    createBreadcrumbs,
    createGraph,
    createOptions,
    createRouteForSearch,
    createRouteForSpecies,
    createUrl,
    fetchData,
    getChainIndex,
};
