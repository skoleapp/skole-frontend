const basePath =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api' : 'https://api.skole.fi';

const apiEndpoints = {
  registerUser: '/user/register',
  loginUser: '/user/login',
  refreshToken: '/user/refresh-token',
  getUser: '/user',
  meUser: 'user/me'
};

export const getApiUrl = (apiName: string, id?: string): string => {
  switch (apiName) {
    case 'register-user':
      return basePath + apiEndpoints.registerUser;
    case 'login-user':
      return basePath + apiEndpoints.loginUser;
    case 'refresh-token':
      return basePath + apiEndpoints.refreshToken;
    case 'get-user':
      return basePath + apiEndpoints.getUser;
    case 'user-detail':
      return basePath + apiEndpoints.getUser + `/${id}`;
    default:
      return basePath;
  }
};
