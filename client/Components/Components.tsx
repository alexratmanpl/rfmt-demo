/**
 * @author Alex Ratman
 */

import React from 'react';
import { Sunburst } from 'react-vis';
import {
    AutoSizer,
    CellMeasurer,
    CellMeasurerCache,
    InfiniteLoader,
    List,
} from 'react-virtualized';
import {
    AppBar,
    Breadcrumbs,
    Chip,
    ClickAwayListener,
    Divider,
    IconButton,
    InputAdornment,
    InputBase,
    ListItem,
    ListItemText,
    Paper,
    Toolbar,
    Typography,
} from '@material-ui/core';
import {
    Close as CloseIcon,
    Home as HomeIcon,
    Search as SearchIcon,
} from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import {
    areCategoriesPropsEqual,
    areGraphPropsEqual,
    areMenuPropsEqual,
    areMonitorPropsEqual,
    areNavigationPropsEqual,
    areSearchResultsPropsEqual,
    createGraph,
    getChainIndex
} from '../Helpers/Helpers.js';
import {
    sunburstColorScale,
    sunburstStyles,
    useCategoriesStyles,
    useMenuStyles,
    useMonitorStyles,
    useSearchResultsStyles,
    withBreadcrumbStyles,
} from '../Styles/Styles.js';
import type {
    Breadcrumb,
    CategoriesProps,
    Element,
    GraphProps,
    ListRowProps,
    MenuProps,
    MonitorProps,
    NavigationProps,
    ReactNode,
    SearchResultsProps,
} from '../../types/ClientTypes';

/**
 * Virtulized list CellMeasurerCache
 * creates and caches cell sizes dynamically
 */
const cache = new CellMeasurerCache({
    defaultHeight: 70,
    fixedWidth: true,
});

/**
 * Categories
 * @param {string} ancestor - categories parent wnid
 * @param {number} limit - list items limit (displayed at once)
 * @param {Array} list - elements list
 * @param {number} size - category children size
 * @param {function} handleItemClick
 * @param {function} handleLoadMoreRows
 * @returns {*} React element
 */
const Categories = ({
    ancestor,
    limit,
    list,
    size,
    handleItemClick,
    handleLoadMoreRows,
}: CategoriesProps) => {
    const classes = useCategoriesStyles();

    /**
     * @param {number} index - item index
     * @returns {boolean}
     */
    const isRowLoaded = ({ index }: { index: number }): boolean => !!list[index];

    /**
     * @param {Object} data
     * @returns {*} React element
     */
    const getListItem = (data?: any)  => {
        if (!data) return <Typography/>;
        const { count, ...item } = data;
        return (
            <ListItem
                button
                onClick={() => handleItemClick({ ...item, ancestor })}
            >
                <ListItemText
                    primary={<Typography variant="subtitle2">{item ? item.words : ''}</Typography>}
                    secondary={`Elements: ${count}`}
                />
            </ListItem>
        );
    };

    /**
     * @param {number} index
     * @param {string} key
     * @param {Object} style
     * @returns {*} React element
     */
    const rowRenderer = ({
        index,
        key,
        style,
    }: {
        index: number,
        key: string,
        style: object,
    }): ReactNode => {
        const element = list[index];
        let content;

        if (element) {
            const { descendants, ...rest } = element;
            const childrenIndex = getChainIndex({ ancestor, element });
            const count = descendants.length ? descendants[childrenIndex].length : 0;
            content = getListItem({ count, ...rest });
        } else {
            content = <Skeleton>{getListItem()}</Skeleton>;
        }

        return (
            <div
                key={key}
                style={style}
            >
                {content}
                {index !== list.length - 1 ? <Divider/> : null}
            </div>
        );
    };

    return (
        <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={handleLoadMoreRows}
            rowCount={size}
            minimumBatchSize={limit}
        >
            {({onRowsRendered, registerChild}) => (
                <div className={classes.root}>
                    <AutoSizer>
                        {({height, width}) => (
                            <List
                                height={height}
                                onRowsRendered={onRowsRendered}
                                ref={registerChild}
                                rowCount={size}
                                rowHeight={70}
                                rowRenderer={rowRenderer}
                                width={width}
                            />
                        )}
                    </AutoSizer>
                </div>
            )}
        </InfiniteLoader>
    );
};

const categories = React.memo(Categories, areCategoriesPropsEqual);

/**
 * Graph
 * @param {Object} element - selected element data
 * @param {Array} largest - largest children
 * @param {function} handleValueClick - onValueClick handler
 * @param {function} handleValueMouseOver - onValueMouseOver handler
 * @param {function} handleValueMouseOut - onValueMouseOut handler
 * @returns {*} React element
 */
const Graph = ({
    element,
    largest,
    handleValueClick,
    handleValueMouseOver,
    handleValueMouseOut,
}: GraphProps) => {
    const data = createGraph({ element, largest });

    return element && largest.length ? (
            <Sunburst
                hideRootNode
                animation
                data={data}
                colorType={'category'}
                colorRange={sunburstColorScale}
                style={sunburstStyles}
                height={600}
                width={700}
                onValueClick={({
                        ancestor,
                        isSearchResult,
                        wnid,
                        words
                    }) => handleValueClick({
                        ancestor,
                        isSearchResult,
                        wnid,
                        words
                    })
                }
                onValueMouseOver={handleValueMouseOver}
                onValueMouseOut={handleValueMouseOut}
            />
        )
        :
        <Typography variant="button">No more elements</Typography>;
};

const graph = React.memo(Graph, areGraphPropsEqual);

/**
 * Menu
 * @param {Array} ancestors - search results elements parents
 * @param {boolean} isSearchFieldActive
 * @param {Array} list - search results list
 * @param {string} searchFieldValue
 * @param {function} handleClickAway,
 * @param {function} handleResultClick,
 * @param {function} handleSearchFieldFocus
 * @param {function} handleSearchFieldValueChange
 * @returns {*} React element
 */
const Menu = ({
    ancestors,
    isSearchFieldActive,
    list,
    searchFieldValue,
    handleClickAway,
    handleResultClick,
    handleSearchFieldFocus,
    handleSearchFieldValueChange,
}: MenuProps) => {
    const classes = useMenuStyles();

    /**
     * @param {Object} e - event object
     * @returns {void}
     */
    const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>): void =>
        handleSearchFieldValueChange(e.target.value);

    /**
     * @returns {void}
     */
    const handleInputValueClear = (): void => handleSearchFieldValueChange('');

    return (
        <div className={classes.root}>
            <AppBar
                position="static"
                color="primary"
            >
                <Toolbar>
                    <Typography
                        className={classes.title}
                        variant="h6"
                        noWrap
                    >
                        Welcome
                    </Typography>
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon/>
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{'aria-label': 'search'}}
                                onChange={handleInputValueChange}
                                onFocus={handleSearchFieldFocus}
                                value={searchFieldValue}
                                endAdornment={
                                    searchFieldValue ? (
                                        <InputAdornment position="start">
                                            <IconButton
                                                className={classes.closeBtn}
                                                aria-label="clear input value"
                                                size="small"
                                                onClick={handleInputValueClear}
                                            >
                                                <CloseIcon/>
                                            </IconButton>
                                        </InputAdornment>
                                    ) : null
                                }
                            />
                            <SearchResults
                                ancestors={ancestors}
                                isSearchFieldActive={isSearchFieldActive}
                                list={list}
                                handleClickAway={handleClickAway}
                                handleResultClick={handleResultClick}
                            />
                        </div>
                    </ClickAwayListener>
                </Toolbar>
            </AppBar>
        </div>
    );
};

const menu = React.memo(Menu, areMenuPropsEqual);

/**
 * Monitor
 * @param {string} header
 * @param {number} limit
 * @param {string} selected
 * @param {number} size
 * @returns {*} React element
 */
const Monitor = ({
    header,
    limit,
    selected,
    size
}: MonitorProps) => {
    const classes = useMonitorStyles();

    /**
     * @param {string} header
     * @returns {*} React element
     */
    const getHeader = (header: string): ReactNode =>
        header ? `Top ${limit} Subcategories of: ${header}` : `Top ${limit} Subcategories`;

    /**
     * @param {number} size
     * @param {string} text
     * @returns {*} React element
     */
    const getText = ({
        size,
        text,
    }: {
        size: number,
        text: string,
    }): ReactNode => {
        if (!size) return null;
        return (
            <Typography variant="body1" className={classes.root}>
                {text ? `Category: ${text}` : 'Check category name by hovering over graph'}
            </Typography>
        )
    };

    return (
        <React.Fragment>
            <Typography variant="h6" className={classes.root}>
                {getHeader(header)}
            </Typography>
            {getText({ text: selected, size })}
        </React.Fragment>
    );
};

const monitor = React.memo(Monitor, areMonitorPropsEqual);

/**
 * Navigation
 * @param {Array} breadcrumbs
 * @param {function} handleChipClick
 * @returns {*} React element
 */
const Navigation = ({
    breadcrumbs,
    handleChipClick,
}: NavigationProps) => (
    <Breadcrumbs aria-label="breadcrumb">
        <StyledBreadcrumb
            label="Home"
            icon={<HomeIcon fontSize="small"/>}
            onClick={() => handleChipClick({})}
        />
        {breadcrumbs.map((breadcrumb: Breadcrumb, index: number) => {
            if (!breadcrumb) return <Typography key={index}>...</Typography>;

            const {
                wnid,
                words
            } = breadcrumb;

            return (
                <StyledBreadcrumb
                    key={wnid}
                    label={words}
                    onClick={() => handleChipClick(breadcrumb)}
                />
            );
        })}
    </Breadcrumbs>
);

const StyledBreadcrumb = withBreadcrumbStyles(Chip);

const navigation = React.memo(Navigation, areNavigationPropsEqual);

/**
 * SearchResults
 * @param {Array} ancestors - search results elements parents
 * @param {boolean} isSearchFieldActive
 * @param {Array} list - search results list
 * @param {function} handleItemClick
 * @returns {*} React element
 */
const SearchResults = ({
    ancestors,
    isSearchFieldActive,
    list,
    handleResultClick,
}: SearchResultsProps) => {
    const classes = useSearchResultsStyles();

    cache.clearAll(); // clear CellMeasurerCache for new cell sizes

    /**
     * @param {Array} element
     * @returns {*} React element
     */
    const getChips = (element: Element): ReactNode =>
        element.ancestors.map((ancestorWnid: string, index: number) => {
            const {words} = ancestors!.filter(ancestor => ancestor.wnid === ancestorWnid)[0];
            const handleChipClick = (): Promise<any> => handleResultClick({
                ancestor: ancestorWnid,
                isSearchResult: true,
                wnid: element.wnid,
                words: element.words,
            });

            return (
                <div
                    className={classes.chipRoot}
                    key={ancestorWnid}
                >
                    <Chip
                        color="primary"
                        className={classes.chip}
                        clickable
                        label={words}
                        onClick={handleChipClick}
                        size="small"
                    />
                    <Typography variant="caption">{`${element.size[index] || 0} element(s)`}</Typography>
                </div>
            );
        });

    /**
     * @param {Array} ancestors
     * @returns {*} React element
     */
    const getCategories = (ancestors: Array<Element | any>): ReactNode =>
        ancestors.length ? (
            <Typography
                display="block"
                variant="caption"
            >
                Categories:
            </Typography>
        ): null;

    /**
     * @param {Object} element
     * @param {Object} style
     * @returns {*} React element
     */
    const getListItem = ({
        element,
        style
    }: {
        element: Element,
        style: object
    }): ReactNode => {
        const { words } = element;

        return (
            <div
                className={classes.listItem}
                style={style}
            >
                <Typography variant="subtitle2">{words}</Typography>
                {getCategories(element.ancestors)}
                {getChips(element)}
                <Divider/>
            </div>
        );
    };

    /**
     * @returns {boolean}
     */
    const isActive = (): boolean => !!(list && list.length && isSearchFieldActive);

    /**
     * @param {string} key
     * @param {number} index
     * @param {string} parent
     * @param {Object} style
     * @returns {*} React element
     */
    const rowRenderer = ({
        index,
        key,
        parent,
        style
    }: ListRowProps): ReactNode => {
        const element = list![index];

        return (
            <CellMeasurer
                cache={cache}
                columnIndex={0}
                key={key}
                parent={parent}
                rowIndex={index}
            >
                {getListItem({ element, style })}
            </CellMeasurer>
        );
    };

    return isActive() ? (
        <Paper
            classes={{
                root: classes.root,
            }}
        >
            <List
                deferredMeasurmentCache={cache}
                height={300}
                rowCount={list!.length}
                rowHeight={cache.rowHeight}
                rowRenderer={rowRenderer}
                width={500}
            />
        </Paper>
    ) : null;
};

const searchResults = React.memo(SearchResults, areSearchResultsPropsEqual);

export {
    categories as Categories,
    graph as Graph,
    menu as Menu,
    monitor as Monitor,
    navigation as Navigation,
};
