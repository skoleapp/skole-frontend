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
      return '';
  }
};
