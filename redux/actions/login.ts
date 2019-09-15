import { Dispatch } from 'redux';
import { loginSuccessMessage } from '../../static';
import { createError, getApiUrl, skoleAPI } from '../../utils';
import { createMessage } from '../../utils/createMessage';
import { LOGIN, LOGIN_ERROR, LOGIN_SUCCESS } from './types';

interface LoginParams {
  usernameOrEmail: string;
  password: string;
}

// eslint-disable-next-line
export const login: any = ({ usernameOrEmail, password }: LoginParams) => async (
  dispatch: Dispatch
): Promise<void> => {
  const payload = {
    username_or_email: usernameOrEmail, // eslint-disable-line
    password: password
  };

  dispatch({ type: LOGIN });

  try {
    const url = getApiUrl('login');
    const { data } = await skoleAPI.post(url, payload);

    const msg = loginSuccessMessage('test');

    setTimeout(() => {
      createMessage(msg);
    }, 500);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.token
    });
  } catch (error) {
    createError(error);

    dispatch({
      type: LOGIN_ERROR,
      payload: error
    });
  }
};
