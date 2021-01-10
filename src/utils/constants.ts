import {
  AssignmentOutlined,
  ContactSupportOutlined,
  EditOutlined,
  LockOutlined,
  SecurityOutlined,
  SettingsBackupRestoreOutlined,
  StorageOutlined,
} from '@material-ui/icons';

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
export const GET_STARTED_PAGE_VISITED_KEY = 'get-started-page-visited';
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
export const DATE_PICKER_FORMAT = 'DD/MM/YYYY';

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

export const PITCH_ITEMS = [
  {
    header: 'get-started:materialsPitchHeader',
    bullets: [
      'get-started:materialsBullet1',
      'get-started:materialsBullet2',
      'get-started:materialsBullet3',
    ],
  },
  {
    header: 'get-started:discussionPitchHeader',
    bullets: [
      'get-started:discussionBullet1',
      'get-started:discussionBullet2',
      'get-started:discussionBullet3',
    ],
  },
];

export const FOR_TEACHERS_PITCH_ITEMS = [
  {
    header: 'for-teachers:studentsPitchHeader',
    bullets: ['for-teachers:studentsBullet1', 'for-teachers:studentsBullet2'],
  },
  {
    header: 'for-teachers:teachersPitchHeader',
    bullets: ['for-teachers:teachersBullet1', 'for-teachers:teachersBullet2'],
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
  common: [
    {
      icon: ContactSupportOutlined,
      text: 'common:contact',
      href: urls.contact,
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
  ],
};
