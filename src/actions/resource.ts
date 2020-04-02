import { Dispatch } from 'react';
import { AnyAction } from 'redux';

export const SET_CENTER = 'SET_CENTER';
export const PREV_PAGE = 'PREV_PAGE';
export const NEXT_PAGE = 'NEXT_PAGE';
export const SET_PAGES = 'SET_PAGES';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_CURRENT_MAP = 'SET_CURRENT_MAP';

export const setCenter = () => (dispatch: Dispatch<AnyAction>): void => {
    console.log('SET_CENTER');
    dispatch({ type: SET_CENTER });
};
export const prevPage = () => (dispatch: Dispatch<AnyAction>): void => {
    console.log('PREV_PAGE');

    dispatch({ type: PREV_PAGE });
};
export const nextPage = () => (dispatch: Dispatch<AnyAction>): void => {
    console.log('NEXT_PAGE');

    dispatch({ type: NEXT_PAGE });
};
export const setPages = (pages: any) => (dispatch: Dispatch<AnyAction>): void => {
    console.log('SET_PAGES');

    dispatch({ type: SET_PAGES, payload: pages });
};
export const setCurrentPage = (currentPage: any) => (dispatch: Dispatch<AnyAction>): void => {
    console.log('SET_CURRENT_PAGE');

    dispatch({ type: SET_CURRENT_PAGE, payload: currentPage });
};
export const setCurrentMap = (map: any) => (dispatch: Dispatch<AnyAction>): void => {
    console.log('SET_CURRENT_PAGE');

    dispatch({ type: SET_CURRENT_MAP, payload: map });
};
