import { AnyAction } from 'redux';
import { CLOSE_NOTIFICATION, OPEN_NOTIFICATION } from '../actions';
import { Notification } from '../interfaces';

export const initialState: Notification = {
  open: false,
  message: null
};

export const notificationReducer = (state = initialState, action: AnyAction): Notification => {
  switch (action.type) {
    case OPEN_NOTIFICATION: {
      return { open: true, message: action.payload };
    }

    case CLOSE_NOTIFICATION: {
      return { open: false, message: null };
    }

    default:
      return state;
  }
};
