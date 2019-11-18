import { AnyAction } from 'redux';
import { CLOSE_NOTIFICATION, OPEN_NOTIFICATION } from '../actions';
import { Notifications } from '../interfaces';

export const initialState: Notifications = {
  open: false,
  message: null
};

export const notificationReducer = (state = initialState, action: AnyAction): Notifications => {
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
