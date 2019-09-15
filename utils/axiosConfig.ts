import axios, { AxiosResponse } from 'axios';
import { basePath } from './api';

export const skoleAPI = axios.create({
  baseURL: basePath
});

const responseHandler = (response: AxiosResponse) => {
  const { data } = response;

  if (data.error) {
    return Promise.reject(data.error);
  }

  return Promise.resolve(response);
};

const errorHandler = (error: AxiosResponse) => {
  return Promise.reject({ ...error });
};

skoleAPI.interceptors.response.use(
  response => responseHandler(response),
  error => errorHandler(error)
);
