export const basePath =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api' : 'https://api.skole.fi';

const apiEndpoints = {
  register: '/user/register/',
  login: '/user/login/',
  refreshToken: '/user/refresh-token/',
  getUser: '/user/',
  meUser: '/user/me/',
  course: '/course/'
};

const { register, login, refreshToken, getUser, course } = apiEndpoints;

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
    case 'course':
      return course;
    default:
      return basePath;
  }
};
