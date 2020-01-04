import { Dispatch } from 'react';
import { AnyAction } from 'redux';

export const OPEN_NOTIFICATION = 'OPEN_NOTIFICATION';
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const openNotification: any = (message: string) => (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: OPEN_NOTIFICATION, payload: message });
};

export const closeNotification = () => (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: CLOSE_NOTIFICATION });
};
