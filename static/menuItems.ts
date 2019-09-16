const menuItems = {
  home: {
    name: 'home',
    href: '/'
  },
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
  },
  search: {
    name: 'search',
    href: '/search'
  }
};

const { home, login, register, account, logout, search } = menuItems;

export const publicMenuItems = [home, login, register, search];
export const privateMenuItems = [home, account, logout, search];
