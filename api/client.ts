import axios from 'axios';

export const serverErrorMessage = 'Looks like our server is down, please try again later...';
export const unableToRetrieveDataMessage =
  'Unable to retrieve data from the server, please try again later...';

export const basePath =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api' : 'https://api.skole.fi';

export const skoleAPI = axios.create({
  baseURL: basePath
});

// eslint-disable-next-line
const responseHandler = (response: any): Promise<any> => {
  const { data, status } = response;
  return Promise.resolve({ data, status });
};

// eslint-disable-next-line
const errorHandler = (error: any): Promise<any> => {
  if (error.response) {
    const { data, status } = error.response;
    return Promise.resolve({ data, status });
  }

  // Server not available
  return Promise.reject({
    data: { error: serverErrorMessage },
    status: 503
  });
};

skoleAPI.interceptors.response.use(
  response => responseHandler(response),
  error => errorHandler(error)
);
