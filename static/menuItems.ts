const menuItems = {
  login: {
    name: 'login',
    href: '/login',
    requireAuth: 'false'
  },
  register: {
    name: 'register',
    href: '/register'
  },
  account: {
    name: 'account',
    href: '/account'
  },
  logout: {
    name: 'logout',
    href: '/logout'
  }
};

const { login, register, account, logout } = menuItems;

export const publicMenuItems = [login, register];
export const privateMenuItems = [account, logout];
