/**
 * @author Alex Ratman
 */

import React, {
    useEffect,
    useState,
} from 'react';
import {
    Grid,
    Paper,
    Typography,
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import {
    Categories,
    Graph,
    Menu,
    Monitor,
    Navigation,
} from './Components/Components.js';
import {
    createBreadcrumbs,
    createOptions,
    createRouteForSearch,
    createRouteForSpecies,
    createUrl,
    fetchData,
    getChainIndex,
} from './Helpers/Helpers.js';
import { appTheme, useAppStyles } from './Styles/Styles.js';
import type {
    AppChildrenUpdate,
    AppDataTraverse,
    AppProps,
    Breadcrumb,
    Element,
    FunctionComponent,
    SearchList,
} from '../types/ClientTypes';

/**
 * Base config - normally I used to keep it in a separate file
 * but since I use JS modules for the web this would be another
 * file to import - which may have no sense here
 */
const config = {
    api: {
        protocol: 'http',
        domain: 'localhost',
        port: 8081,
        routes: {
            descendants: 'api/species/get/wnids',
            element: 'api/species/get',
            largest: 'api/species/get/largest',
            search: 'api/search',
        },
    },
    data: {
        limit: 20,
    },
};

/**
 * App
 * @param {Object} props
 * @returns {*} React element
 */
const App: FunctionComponent<AppProps> = props => {
    const classes = useAppStyles();
    const { largest: initialLargest, ...initialData } = props;
    const { api } = config;

    const [breadcrumbs, setBreadcrumbs] = useState<Array<Breadcrumb>>([]);
    const [data, setData] = useState(initialData);
    const [largest, setLargest] = useState(initialLargest);
    const [limit, setLimit] = useState<number>(config.data.limit);
    const [isSearchFieldActive, setSearchFieldActive] = useState<boolean>(false);
    const [searchFieldValue, setSearchFieldValue] = useState<string>('');
    const [searchList, setSearchList] = useState<SearchList>({ ancestors: [], elements: [] });
    const [selected, setSelected] = useState<string>('');

    // Handlers
    /**
     * @param {number} startIndex
     * @param {number} stopIndex
     * @returns {Promise} representing handler operation results
     */
    const handleChildrenUpdate = async ({
        startIndex = 0,
        stopIndex = limit
    }: AppChildrenUpdate): Promise<any> => {
        try {
            const {
                ancestor,
                descendants,
                element,
            } = data;
            const index = getChainIndex({ element, ancestor }); // find specific chaining parent -> children
            const wnids = element.descendants![index].slice(startIndex, stopIndex + 1); // get children wnids
            const route = createRouteForSpecies({ path: api.routes.descendants });
            const url = createUrl({ ...api, route });
            const options = createOptions({body: {wnids}});
            const result = await fetchData({ options, url });
            setData({
                ...data,
                descendants: [...descendants, ...result.descendants!],
            });
        } catch (e) {
            console.error(e);
        }
    };

    /**
     * @param {string} ancestor
     * @param {boolean} isSearchResult
     * @param {string} wnid
     * @param {string} words
     * @returns {Promise} representing handler operation results
     */
    const handleDataTraverse = async ({
        ancestor,
        isSearchResult,
        wnid,
        words,
    }: AppDataTraverse): Promise<any> => {
        const { root } = data;
        let result;
        let route;
        let url;

        // Create breadcrumbs
        const updatedBreadcrumbs = createBreadcrumbs({
            ancestor,
            breadcrumbs,
            isSearchResult,
            root,
            wnid,
            words,
        });
        setBreadcrumbs(updatedBreadcrumbs);

        setSelected('');

        // This operation can be easily done using useEffect as well, there is couple of ways to have this done
        // Update data
        try {
            route = createRouteForSpecies({
                ancestor,
                path: api.routes.element,
                wnid,
            });
            url = createUrl({ ...api, route });
            result = await fetchData({ url });
            setData({ ...data, ...result });
        } catch (e) {
            console.error(e);
        }

        // Update largest
        try {
            route = createRouteForSpecies({
                ancestor,
                path: api.routes.largest,
                wnid,
            });
            url = createUrl({ ...api, route });
            result = await fetchData({ url });
            setLargest(result.largest);
        } catch (e) {
            console.error(e);
        }
    };

    /**
     * @param {Object} selected - selected graph value
     * @returns {void}
     */
    const handleMonitorText = (selected?: Element): void =>
        selected ? setSelected(selected.words) : setSelected('');

    /**
     * @returns {void}
     */
    const handleSearchFieldBlur = (): void => setSearchFieldActive(false);

    /**
     * @returns {void}
     */
    const handleSearchFieldFocus = (): void => setSearchFieldActive(true);

    /**
     * @param {string} value
     * @returns {void}
     */
    const handleSearchFieldValueChange = (value: string): void => setSearchFieldValue(value);

    // Hooks
    useEffect(
        () => {
            (async () => {
                if (searchFieldValue) {
                    const route = createRouteForSearch({
                        path: api.routes.search,
                        query: searchFieldValue,
                    });
                    const url = createUrl({ ...api, route });
                    const { ancestors, elements } = await fetchData({ url });
                    return setSearchList({ ancestors, elements });
                }
                setSearchList({ ancestors: [], elements: [] });
            })();
        },
        [searchFieldValue],
    );

    return (
        <ThemeProvider theme={appTheme}>
            <Grid container spacing={0}>
                <Grid className={classes.root} item xs={12}>
                    <Menu
                        ancestors={searchList.ancestors}
                        isSearchFieldActive={isSearchFieldActive}
                        list={searchList.elements}
                        searchFieldValue={searchFieldValue}
                        handleClickAway={handleSearchFieldBlur}
                        handleResultClick={handleDataTraverse}
                        handleSearchFieldFocus={handleSearchFieldFocus}
                        handleSearchFieldValueChange={handleSearchFieldValueChange}
                    />
                </Grid>
                <Grid className={classes.box} item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper className={classes.box}>
                                <Navigation
                                    breadcrumbs={breadcrumbs}
                                    handleChipClick={handleDataTraverse}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper className={classes.container}>
                                <Typography variant="h6">All Subcategories:</Typography>
                                <Categories
                                    ancestor={data.element.wnid}
                                    limit={limit}
                                    list={data.descendants}
                                    size={data.element.size[
                                        getChainIndex({
                                            ancestor: data.ancestor,
                                            element: data.element,
                                        })] || 0
                                    }
                                    handleItemClick={handleDataTraverse}
                                    handleLoadMoreRows={handleChildrenUpdate}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper className={classes.container}>
                                <Monitor
                                    header={data.element.words}
                                    limit={limit}
                                    selected={selected}
                                    size={largest.length}
                                />
                                <Graph
                                    element={data.element}
                                    largest={largest}
                                    handleValueMouseOut={() => handleMonitorText()}
                                    handleValueMouseOver={handleMonitorText}
                                    handleValueClick={handleDataTraverse}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default App;
