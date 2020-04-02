import { AnyAction } from 'redux';

import { SET_CENTER, PREV_PAGE, NEXT_PAGE, SET_PAGES, SET_CURRENT_PAGE } from '../actions';

export interface ResourceState {
    pages: any[];
    currentPage: number;
    effect: string;
}

const initialState: ResourceState = {
    pages: [],
    currentPage: 0,
    effect: '',
};

export const resourceReducer = (state = initialState, action: AnyAction): ResourceState => {
    switch (action.type) {
        case SET_CENTER: {
            return { ...state, effect: SET_CENTER };
        }
        case PREV_PAGE: {
            return { ...state, effect: PREV_PAGE };
        }
        case NEXT_PAGE: {
            return { ...state, effect: NEXT_PAGE };
        }
        case SET_PAGES: {
            return { ...state, pages: action.payload, effect: '' };
        }
        case SET_CURRENT_PAGE: {
            return { ...state, currentPage: action.payload, effect: '' };
        }
        default: {
            return state;
        }
    }
};
