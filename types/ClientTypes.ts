/**
 * @author Alex Ratman
 */

import type { ReactNode } from "react";

export interface ApiResponse {
    ancestors?: Array<Element | any>,
    element?: Element,
    elements?: Array<Element | any>,
    descendants?: Array<any>,
    largest: Array<any>,
    results?: Array<any>
}

export interface AppChildrenUpdate {
    startIndex: number,
    stopIndex: number,
}

export interface AppDataTraverse extends Breadcrumb {
    isSearchResult?: boolean,
}

export interface AppProps {
    ancestor?: string,
    children?: ReactNode,
    descendants: Array<any>,
    element: Element,
    largest: Array<any>,
    parent?: string,
    root?: string,
}

export interface Breadcrumb {
    ancestor?: string,
    wnid?: string,
    words?: string,
}

export interface CategoriesProps {
    ancestor?: string,
    limit: number,
    list: Array<Element | any>,
    size: number,
    handleItemClick: (params: AppDataTraverse) => Promise<any>,
    handleLoadMoreRows: (params: AppChildrenUpdate) => Promise<any>,
}

export interface CreateBreadcrumbs extends AppDataTraverse {
    breadcrumbs?: Array<Breadcrumb>,
    root?: string
}

export interface Element {
    ancestors: Array<any>,
    descendants: Array<Array<number>>
    gloss: string,
    size: Array<number>,
    wnid: string,
    words: string,
}

export interface GraphProps {
    element: Element,
    largest: Array<any>,
    handleValueClick: (params: AppDataTraverse) => Promise<any>,
    handleValueMouseOver: () => void,
    handleValueMouseOut: () => void,
}

export interface MenuProps {
    ancestors?: Array<Element | any>,
    isSearchFieldActive : boolean,
    list?: Array<Element | any>,
    searchFieldValue: string,
    handleClickAway: () => void,
    handleResultClick: (params: AppDataTraverse) => Promise<any>,
    handleSearchFieldFocus: () => void,
    handleSearchFieldValueChange: (e: any) => void,
}

export interface MonitorProps {
    header: string,
    limit: number,
    selected: string,
    size: number,
}

export interface NavigationProps {
    breadcrumbs: Array<Breadcrumb>,
    handleChipClick: (params: AppDataTraverse) => Promise<any>,
}

export interface SearchList {
    ancestors?: Array<Element | any>,
    elements?: Array<Element | any>,
}

export interface SearchResultsProps {
    ancestors?: Array<Element | any>,
    isSearchFieldActive : boolean,
    list?: Array<Element | any>,
    handleClickAway: () => void,
    handleResultClick: (params: AppDataTraverse) => Promise<any>,
}

export type { ReactNode };
export type { FunctionComponent } from 'react'
export type { ListRowProps } from 'react-virtualized';
export type { SunburstPoint } from 'react-vis'
