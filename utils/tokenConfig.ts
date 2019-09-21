import { AxiosRequestConfig } from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tokenConfig = (token: string | null): AxiosRequestConfig => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    }
  };
};
