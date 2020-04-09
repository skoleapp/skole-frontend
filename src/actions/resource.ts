import { Map } from 'ol';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

import { Page } from '../components/shared/PDFViewer';

export const SET_CENTER = 'SET_CENTER';
export const PREV_PAGE = 'PREV_PAGE';
export const NEXT_PAGE = 'NEXT_PAGE';
export const SET_PAGES = 'SET_PAGES';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_CURRENT_MAP = 'SET_CURRENT_MAP';
export const RESET_EFFECT = 'RESET_EFFECT';

export const resetEffect = () => (dispatch: Dispatch<AnyAction>): void => {
    dispatch({ type: RESET_EFFECT });
};

export const setCenter = () => (dispatch: Dispatch<AnyAction>): void => {
    dispatch({ type: SET_CENTER });
};

export const prevPage = () => (dispatch: Dispatch<AnyAction>): void => {
    dispatch({ type: PREV_PAGE });
};

export const nextPage = () => (dispatch: Dispatch<AnyAction>): void => {
    dispatch({ type: NEXT_PAGE });
};

export const setPages = (pages: Page[]) => (dispatch: Dispatch<AnyAction>): void => {
    dispatch({ type: SET_PAGES, payload: pages });
};

export const setCurrentPage = (currentPage: number) => (dispatch: Dispatch<AnyAction>): void => {
    dispatch({ type: SET_CURRENT_PAGE, payload: currentPage });
};

export const setCurrentMap = (map: Map) => (dispatch: Dispatch<AnyAction>): void => {
    dispatch({ type: SET_CURRENT_MAP, payload: map });
};
