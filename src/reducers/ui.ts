import { AnyAction } from 'redux';

import { CommentObjectType } from '../../generated/graphql';
import { TOGGLE_COMMENT_THREAD, TOGGLE_FILE_VIEWER, TOGGLE_NOTIFICATION, TOGGLE_SETTINGS } from '../actions';

export interface UI {
    notification: string | null;
    settings: boolean | null;
    commentThread: CommentObjectType | null;
    file: string | null;
}

const initialState: UI = {
    notification: null,
    settings: null,
    commentThread: null,
    file: null,
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

        case TOGGLE_FILE_VIEWER: {
            return { ...state, file: action.payload };
        }

        default: {
            return state;
        }
    }
};
