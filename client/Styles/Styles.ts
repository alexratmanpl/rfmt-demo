/**
 * @author Alex Ratman
 */

import {
    createMuiTheme,
    emphasize,
    fade,
    makeStyles,
    withStyles,
} from '@material-ui/core/styles';
import * as colors from '@material-ui/core/colors';

/**
 * Graph
 */
const sunburstColorScale = (() => {
    const scale = [];
    for (let [, range] of Object.entries(colors)) {
        for (let [, hex] of Object.entries(range)) {
            scale.push(hex);
        }
    }
    return scale;
})();

const sunburstStyles = {
    stroke: '#fff'
};

/**
 * Themes
 */
const appTheme = createMuiTheme({
    palette: {
        primary: {
            main: colors.blue[500],
        },
    },
});

/**
 * Styles
 */
const useAppStyles = makeStyles((theme) => ({
    box: {
        padding: theme.spacing(2),
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
        height: '760px',
    },
    root: {
        position: 'relative',
    }
}));

const useCategoriesStyles = makeStyles(() => ({
    root: {
        flex: '1 1 auto',
    }
}));

const useMenuStyles = makeStyles((theme) => ({
    closeBtn: {
        color: 'white',
    },
    inputInput: {
        width: '100%',
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '20ch',
            '&:focus': {
                width: '25ch',
            },
        },
    },
    inputRoot: {
        color: 'inherit',
    },
    root: {
        flexGrow: 1,
    },
    search: {
        position: 'relative',
        width: '100%',
        marginLeft: 0,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        height: '100%',
        padding: theme.spacing(0, 2),
        pointerEvents: 'none',
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
}));

const useMonitorStyles = makeStyles(() => ({
    root: {
        minHeight: '64px',
    },
}));

const useSearchResultsStyles = makeStyles((theme) => ({
    chip: {
        marginRight: '5px',
    },
    chipRoot: {
        paddingBottom: theme.spacing(1),
    },
    listItem: {
        padding: theme.spacing(1),
    },
    root: {
        position: 'absolute',
        right: '0',
        top: 'calc(100% + 10px)',
        padding: theme.spacing(3),
        backgroundColor: '#f5f5f5',
    },
}));

const withBreadcrumbStyles = withStyles((theme) => ({
    root: {
        height: theme.spacing(3),
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.grey[800],
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.grey[300],
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(theme.palette.grey[300], 0.12),
        },
    },
}));

export {
    appTheme,
    sunburstColorScale,
    sunburstStyles,
    useAppStyles,
    useCategoriesStyles,
    useMenuStyles,
    useMonitorStyles,
    useSearchResultsStyles,
    withBreadcrumbStyles,
};
