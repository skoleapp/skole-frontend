import { AnyAction, Dispatch } from 'redux';
import { registerSuccessMessage } from '../../static';
import { createError, getApiUrl, skoleAPI } from '../../utils';
import { createMessage } from '../../utils/createMessage';
import { REGISTER, REGISTER_ERROR, REGISTER_SUCCESS } from './types';

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const register: any = ({
  username,
  email,
  password,
  confirmPassword
}: RegisterParams) => async (dispatch: Dispatch): Promise<AnyAction> => {
  return new Promise(async (resolve, reject) => {
    dispatch({ type: REGISTER });

    const payload = {
      username,
      email,
      password: {
        password,
        confirm_password: confirmPassword
      }
    };

    try {
      const url = getApiUrl('register');
      const { data } = await skoleAPI.post(url, payload);

      const msg = registerSuccessMessage(data.data.username);

      setTimeout(() => {
        createMessage(msg);
      }, 250);

      resolve(dispatch({ type: REGISTER_SUCCESS }));
    } catch (error) {
      createError(error);
      reject(
        dispatch({
          type: REGISTER_ERROR,
          payload: error
        })
      );
    }
  });
};
