import { Dispatch } from 'react';
import { AnyAction } from 'redux';

export const TOGGLE_SETTINGS = 'TOGGLE_SETTINGS';

export const toggleSettings = (open: boolean) => (dispatch: Dispatch<AnyAction>): void => {
    dispatch({ type: TOGGLE_SETTINGS, payload: open });
};
