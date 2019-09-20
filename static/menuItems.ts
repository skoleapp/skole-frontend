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
  courses: {
    name: 'courses',
    href: '/courses'
  }
};

const { home, login, register, account, logout, courses } = menuItems;

export const publicMenuItems = [home, login, register, courses];
export const privateMenuItems = [home, account, logout, courses];
