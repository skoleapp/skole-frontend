import axios from 'axios';

export const serverErrorMessage = 'Looks like our server is down, please try again later...';
export const unableToRetrieveDataMessage =
  'Unable to retrieve data from the server, please try again later...';

export const basePath =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api' : 'https://api.skole.fi';

const apiEndpoints = {
  register: '/user/register/',
  login: '/user/login/',
  refreshToken: '/user/refresh-token/',
  getUser: '/user/',
  userMe: '/user/me/',
  course: '/course/'
};

const { register, login, refreshToken, getUser, course, userMe } = apiEndpoints;

export const getApiUrl = (apiName: string): string => {
  switch (apiName) {
    case 'register':
      return register;
    case 'login':
      return login;
    case 'refresh-token':
      return refreshToken;
    case 'get-user':
      return getUser;
    case 'user-me':
      return userMe;
    case 'course':
      return course;
    default:
      return basePath;
  }
};

export const skoleAPI = axios.create({
  baseURL: basePath
});

// eslint-disable-next-line
const responseHandler = (response: any): Promise<any> => {
  if (response) {
    return Promise.resolve(response);
  }

  return Promise.reject({ serverError: unableToRetrieveDataMessage });
};

// eslint-disable-next-line
const errorHandler = (error: any): Promise<any> => {
  if (error.response && error.response.data) {
    const { data } = error.response;

    if (data.error) {
      return Promise.reject(data.error);
    }

    return Promise.reject(data);
  }

  return Promise.reject({ serverError: serverErrorMessage });
};

skoleAPI.interceptors.response.use(
  response => responseHandler(response),
  error => errorHandler(error)
);
