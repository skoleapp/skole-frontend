import { AnyAction } from 'redux';

import { NEXT_PAGE, PREV_PAGE, RESET_EFFECT, SET_CENTER, SET_CURRENT_PAGE, SET_PAGES } from '../actions';
import { Page } from '../components/shared/PDFViewer';

export interface ResourceState {
    pages: Page[];
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
        case RESET_EFFECT: {
            return { ...state, effect: '' };
        }
        default: {
            return state;
        }
    }
};