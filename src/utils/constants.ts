import { urls } from './urls';

export const LANGUAGES = [
  { label: 'languages:english', value: 'en' },
  { label: 'languages:finnish', value: 'fi' },
  { label: 'languages:swedish', value: 'sv' },
];

export const PDF_DEFAULT_TRANSLATION = { x: 0, y: 0 };
export const PDF_DEFAULT_SCALE = 1.0;
export const PDF_MIN_SCALE = 0.75;
export const PDF_MAX_SCALE = 5;
export const ACCEPTED_ATTACHMENT_FILES = ['image/*'];
export const ACCEPTED_AVATAR_FILES = ['image/*'];
export const MAX_RESOURCE_FILE_SIZE = 10000000; // 10 MB.
export const MAX_RESOURCE_IMAGE_WIDTH_HEIGHT = 1200; // Pixels.
export const MAX_AVATAR_FILE_SIZE = 3500000; // 3.5 MB.
export const MAX_AVATAR_WIDTH_HEIGHT = 200; // Pixels.
export const MAX_COMMENT_ATTACHMENT_FILE_SIZE = 3500000; // 3.5 MB.
export const MAX_COMMENT_ATTACHMENT_WIDTH_HEIGHT = 1200; // Pixels.
export const RESULTS_PER_PAGE_OPTIONS = [25, 50, 75, 100];
export const PASSWORD_MIN_LENGTH = 10; // Should match with whatever backend is using.
export const DATE_PICKER_FORMAT = 'DD-MM-YYYY';
export const LS_LOGOUT_KEY = 'SKOLE_LOGOUT';
export const NATIVE_APP_USER_AGENT = 'skole-native-app';
export const MAX_REVALIDATION_INTERVAL = 1; // Seconds.

// The trailing slash in /account/ means to disallow all subpages.
export const DISALLOWED_PATHS = [
  '/404',
  urls.about,
  urls.activity,
  urls.logout,
  urls.search,
  urls.starred,
  '/account/',
];

export const DYNAMIC_PATHS = ['courses', 'resources', 'schools', 'users'];
export const LOCALE_PATHS = ['', '/fi', '/sv'];

export const DEFAULT_NAMESPACES = [
  'common',
  'error',
  'not-found',
  'languages',
  'forms',
  'validation',
  'notifications',
  'common-tooltips',
  'activity',
  'offline',
  'sharing',
];

export const IMAGE_TYPES = [
  'image/apng',
  'image/bmp',
  'image/gif',
  'image/x-icon',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp	',
];

export const SETTINGS_ITEMS = {
  account: [
    {
      emoji: '🖊️',
      text: 'common:editProfile',
      href: urls.editProfile,
    },
    {
      emoji: '🔑',
      text: 'common:changePassword',
      href: urls.changePassword,
    },
    {
      emoji: '💾',
      text: 'common:myData',
      href: urls.myData,
    },
  ],
  commonAccount: [
    {
      emoji: '😶‍🌫️',
      text: 'common:resetPassword',
      href: urls.resetPassword,
    },
  ],
};

export const ABOUT_ITEMS = [
  {
    emoji: '🧑‍🏫',
    text: 'common:forTeachers',
    href: urls.forTeachers,
  },
  {
    emoji: '🗣️',
    text: 'common:contact',
    href: urls.contact,
  },
  {
    emoji: '🗺️',
    text: 'common:guidelines',
    href: urls.guidelines,
  },
  {
    emoji: '💯',
    text: 'common:score',
    href: urls.score,
  },
  {
    emoji: '💂',
    text: 'common:values',
    href: urls.values,
  },
  {
    emoji: '📃',
    text: 'common:blog',
    href: urls.blogs,
  },
  {
    emoji: '👮',
    text: 'common:terms',
    href: urls.terms,
  },
  {
    emoji: '🔒',
    text: 'common:privacy',
    href: urls.privacy,
  },
];
