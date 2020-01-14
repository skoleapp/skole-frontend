import { AnyAction } from 'redux';
import { Dispatch } from 'react';

export const TOGGLE_SETTINGS = 'TOGGLE_SETTINGS';

export const toggleSettings = (open: boolean) => (dispatch: Dispatch<AnyAction>): void => {
    dispatch({ type: TOGGLE_SETTINGS, payload: open });
};
