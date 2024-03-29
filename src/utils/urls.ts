export const urls = {
  thread: (slug: string): string => `/threads/${slug}`,
  user: (slug: string): string => `/users/${slug}`,
  about: '/about',
  accountSettings: '/account-settings',
  activity: '/activity',
  badges: '/badges',
  changePassword: '/change-password',
  contact: '/contact',
  deleteAccount: '/delete-account',
  editProfile: '/edit-profile',
  home: '/home',
  index: '/',
  login: '/login',
  logout: '/logout',
  myData: '/my-data',
  privacy: '/privacy',
  register: '/register',
  resetPassword: '/reset-password',
  score: '/score',
  search: '/search',
  starred: '/starred',
  terms: '/terms',
  verifyAccount: '/verify-account',
  verifyBackupEmail: '/verify-backup-email',
};
