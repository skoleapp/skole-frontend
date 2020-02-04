import { AnyAction } from 'redux';

import { TOGGLE_SETTINGS, TOGGLE_NOTIFICATION, TOGGLE_COMMENT_THREAD } from '../actions';
import { CommentObjectType } from '../../generated/graphql';

export interface UI {
    notification: string | null;
    settings: boolean | null;
    commentThread: CommentObjectType | null;
}

const initialState: UI = {
    notification: null,
    settings: null,
    commentThread: null,
};

export const uiReducer = (state = initialState, action: AnyAction): UI => {
    switch (action.type) {
        case TOGGLE_NOTIFICATION: {
            return { ...state, notification: action.payload };
        }

        case TOGGLE_SETTINGS: {
            return { ...state, settings: action.payload };
        }

        case TOGGLE_COMMENT_THREAD: {
            return { ...state, commentThread: action.payload };
        }

        default: {
            return state;
        }
    }
};
