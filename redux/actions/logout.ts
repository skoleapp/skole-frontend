import { Dispatch } from 'redux';
import { LOGOUT_MESSAGE } from '../../static';
import { createMessage } from '../../utils/createMessage';
import { LOGOUT } from './types';

export const logout = () => (dispatch: Dispatch): void => {
  const msg = LOGOUT_MESSAGE;

  setTimeout(() => {
    createMessage(msg);
  }, 500);

  dispatch({ type: LOGOUT });
};
