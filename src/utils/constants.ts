import AssignmentOutlined from '@material-ui/icons/AssignmentOutlined';
import ContactSupportOutlined from '@material-ui/icons/ContactSupportOutlined';
import EditOutlined from '@material-ui/icons/EditOutlined';
import GavelOutlined from '@material-ui/icons/GavelOutlined';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import LibraryBooksOutlined from '@material-ui/icons/LibraryBooksOutlined';
import LockOutlined from '@material-ui/icons/LockOutlined';
import SchoolOutlined from '@material-ui/icons/SchoolOutlined';
import SecurityOutlined from '@material-ui/icons/SecurityOutlined';
import SettingsBackupRestoreOutlined from '@material-ui/icons/SettingsBackupRestoreOutlined';
import StorageOutlined from '@material-ui/icons/StorageOutlined';
import ThumbsUpDownOutlined from '@material-ui/icons/ThumbsUpDownOutlined';

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

// The trailing slash in /account/ means to disallow all subpages.
export const DISALLOWED_PATHS = [
  '/404',
  urls.about,
  urls.activity,
  urls.starred,
  urls.logout,
  '/account/',
];

export const DYNAMIC_PATHS = ['courses', 'resources', 'schools', 'users'];
export const LOCALE_PATHS = ['', '/fi', '/sv'];

export const DEFAULT_NAMESPACES = [
  'common',
  'marketing',
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

export const LANDING_PAGE_PITCH_ITEMS = [
  {
    header: 'index:materialsPitchHeader',
    bullets: [
      'index:materialsBullet1',
      'index:materialsBullet2',
      'index:materialsBullet3',
      'index:materialsBullet4',
    ],
  },
  {
    header: 'index:discussionPitchHeader',
    bullets: [
      'index:discussionBullet1',
      'index:discussionBullet2',
      'index:discussionBullet3',
      'index:discussionBullet4',
    ],
  },
];

export const FOR_TEACHERS_PITCH_ITEMS = [
  {
    header: 'for-teachers:studentsPitchHeader',
    bullets: [
      'for-teachers:studentsBullet1',
      'for-teachers:studentsBullet2',
      'for-teachers:studentsBullet3',
      'for-teachers:studentsBullet4',
    ],
  },
  {
    header: 'for-teachers:teachersPitchHeader',
    bullets: [
      'for-teachers:teachersBullet1',
      'for-teachers:teachersBullet2',
      'for-teachers:teachersBullet3',
      'for-teachers:teachersBullet4',
    ],
  },
  {
    header: 'for-teachers:infoPitchHeader',
    bullets: [
      'for-teachers:infoBullet1',
      'for-teachers:infoBullet2',
      'for-teachers:infoBullet3',
      'for-teachers:infoBullet4',
    ],
  },
];

export const SETTINGS_ITEMS = {
  account: [
    {
      icon: EditOutlined,
      text: 'common:editProfile',
      href: urls.editProfile,
    },
    {
      icon: LockOutlined,
      text: 'common:changePassword',
      href: urls.changePassword,
    },
    {
      icon: StorageOutlined,
      text: 'common:myData',
      href: urls.myData,
    },
  ],
  commonAccount: [
    {
      icon: SettingsBackupRestoreOutlined,
      text: 'common:resetPassword',
      href: urls.resetPassword,
    },
  ],
};

export const ABOUT_ITEMS = [
  {
    icon: SchoolOutlined,
    text: 'common:forTeachers',
    href: urls.forTeachers,
  },
  {
    icon: ContactSupportOutlined,
    text: 'common:contact',
    href: urls.contact,
  },
  {
    icon: InfoOutlined,
    text: 'common:guidelines',
    href: urls.guidelines,
  },
  {
    icon: ThumbsUpDownOutlined,
    text: 'common:score',
    href: urls.score,
  },
  {
    icon: GavelOutlined,
    text: 'common:values',
    href: urls.values,
  },
  {
    icon: LibraryBooksOutlined,
    text: 'common:blog',
    href: urls.blogs,
  },
  {
    icon: AssignmentOutlined,
    text: 'common:terms',
    href: urls.terms,
  },
  {
    icon: SecurityOutlined,
    text: 'common:privacy',
    href: urls.privacy,
  },
];
