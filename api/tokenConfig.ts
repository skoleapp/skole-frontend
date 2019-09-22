import { AxiosRequestConfig } from 'axios';
import { State } from '../interfaces';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tokenConfig = (getState: () => State): AxiosRequestConfig => {
  const { token } = getState().auth;

  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    }
  };
};
