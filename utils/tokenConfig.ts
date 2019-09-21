import { AxiosRequestConfig } from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tokenConfig = () => (getState: any): AxiosRequestConfig => {
  const { token } = getState().auth.token;

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    }
  };

  return config;
};
