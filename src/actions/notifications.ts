import { Dispatch } from 'react';
import { AnyAction } from 'redux';

export const OPEN_NOTIFICATION = 'OPEN_NOTIFICATION';
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';

export const openNotification = (message: string) => (dispatch: Dispatch<AnyAction>): void => {
    dispatch({ type: OPEN_NOTIFICATION, payload: message });
};

export const closeNotification = () => (dispatch: Dispatch<AnyAction>): void => {
    dispatch({ type: CLOSE_NOTIFICATION });
};
