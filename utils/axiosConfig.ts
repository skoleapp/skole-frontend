import axios, { AxiosError, AxiosResponse } from 'axios';
import { basePath } from './api';

export const skoleAPI = axios.create({
  baseURL: basePath
});

// eslint-disable-next-line
const responseHandler = (response: AxiosResponse): Promise<AxiosResponse<any>> => {
  const { data } = response;
  return Promise.resolve(data);
};

// eslint-disable-next-line
const errorHandler = (error: any): Promise<AxiosError<any>> => {
  const { data } = error.response;
  return Promise.reject(data.error);
};

skoleAPI.interceptors.response.use(
  response => responseHandler(response),
  error => errorHandler(error)
);
