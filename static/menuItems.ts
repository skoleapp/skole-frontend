const menuItems = {
  home: {
    name: 'home',
    href: '/'
  },
  login: {
    name: 'login',
    href: '/login'
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

const { home, login, register, account, logout } = menuItems;

export const publicMenuItems = [home, login, register];
export const privateMenuItems = [home, account, logout];
