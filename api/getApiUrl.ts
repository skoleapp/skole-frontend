const apiEndpoints = {
  register: '/user/register/',
  login: '/user/login/',
  refreshToken: '/user/refresh-token/',
  getUser: '/user/',
  userMe: '/user/me/',
  course: '/course/',
  search: '/search/'
};

const { register, login, refreshToken, getUser, course, userMe, search } = apiEndpoints;

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
    case 'search':
      return search;
    default:
      return '';
  }
};
