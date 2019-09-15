import axios, { AxiosResponse } from 'axios';
import { basePath } from './api';

export const skoleAPI = axios.create({
  baseURL: basePath
});

// eslint-disable-next-line
const responseHandler = (response: AxiosResponse): Promise<AxiosResponse<any>> => {
  const { data } = response;

  if (data.error) {
    return Promise.reject(data.error);
  }

  return Promise.resolve(response);
};

// eslint-disable-next-line
const errorHandler = (error: AxiosResponse): Promise<AxiosResponse<any>> => {
  return Promise.reject({ ...error });
};

skoleAPI.interceptors.response.use(
  response => responseHandler(response),
  error => errorHandler(error)
);
