import axios, { AxiosError, AxiosResponse } from 'axios';
import { serverErrorMessage, unableToRetrieveDataMessage } from '../static/messages';
import { basePath } from './api';

export const skoleAPI = axios.create({
  baseURL: basePath
});

// eslint-disable-next-line
const responseHandler = (response: AxiosResponse): any => {
  if (response.data) {
    const { data } = response;
    return Promise.resolve(data);
  }

  return Promise.reject({ serverError: unableToRetrieveDataMessage });
};

// eslint-disable-next-line
const errorHandler = (error: any): Promise<AxiosError<any>> => {
  if (error.response && error.response.data) {
    const { data } = error.response;
    return Promise.reject(data.error);
  }

  return Promise.reject({ serverError: serverErrorMessage });
};

skoleAPI.interceptors.response.use(
  response => responseHandler(response),
  error => errorHandler(error)
);
