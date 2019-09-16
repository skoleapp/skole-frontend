import { AnyAction, Dispatch } from 'redux';
import { createErrors, getApiUrl, skoleAPI } from '../../utils';
import { REGISTER, REGISTER_ERROR, REGISTER_SUCCESS } from './types';
export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const register = ({ username, email, password, confirmPassword }: RegisterParams) => (
  dispatch: Dispatch
): Promise<AnyAction> => {
  return new Promise(
    // eslint-disable-next-line no-async-promise-executor
    async (resolve, reject): Promise<void> => {
      dispatch({ type: REGISTER });

      const payload = {
        username,
        email,
        password: {
          password,
          confirm_password: confirmPassword // eslint-disable-line
        }
      };

      try {
        const url = getApiUrl('register');
        const { message } = await skoleAPI.post(url, payload);
        resolve(dispatch({ type: REGISTER_SUCCESS, payload: message }));
      } catch (error) {
        reject(dispatch({ type: REGISTER_ERROR, payload: createErrors(error) }));
      }
    }
  );
};
