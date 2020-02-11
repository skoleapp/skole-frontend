import { Dispatch } from 'react';
import { AnyAction } from 'redux';

import { CommentObjectType } from '../../generated/graphql';

export const TOGGLE_NOTIFICATION = 'TOGGLE_NOTIFICATION';
export const TOGGLE_SETTINGS = 'TOGGLE_SETTINGS';
export const TOGGLE_COMMENT_THREAD = 'TOGGLE_COMMENT_THREAD';

export const toggleNotification = (payload: string | null) => (dispatch: Dispatch<AnyAction>): void => {
    dispatch({ type: TOGGLE_NOTIFICATION, payload });
};

export const toggleSettings = (payload: boolean) => (dispatch: Dispatch<AnyAction>): void => {
    dispatch({ type: TOGGLE_SETTINGS, payload });
};

export const toggleCommentThread = (payload: CommentObjectType | null) => (dispatch: Dispatch<AnyAction>): void => {
    dispatch({ type: TOGGLE_COMMENT_THREAD, payload });
};
