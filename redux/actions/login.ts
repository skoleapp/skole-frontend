import { AnyAction, Dispatch } from 'redux';
import { createErrors, getApiUrl, skoleAPI } from '../../utils';
import { LOGIN, LOGIN_ERROR, LOGIN_SUCCESS } from './types';

interface LoginParams {
  usernameOrEmail: string;
  password: string;
}

export const login = ({ usernameOrEmail, password }: LoginParams) => (
  dispatch: Dispatch
): Promise<AnyAction> => {
  return new Promise(
    // eslint-disable-next-line no-async-promise-executor
    async (resolve, reject): Promise<void> => {
      const payload = {
        username_or_email: usernameOrEmail, // eslint-disable-line @typescript-eslint/camelcase
        password: password
      };

      dispatch({ type: LOGIN });

      try {
        const url = getApiUrl('login');
        const { token } = await skoleAPI.post(url, payload);
        resolve(dispatch({ type: LOGIN_SUCCESS, payload: token }));
      } catch (error) {
        reject(dispatch({ type: LOGIN_ERROR, payload: createErrors(error) }));
      }
    }
  );
};
