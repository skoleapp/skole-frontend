import ContactSupportOutlined from '@material-ui/icons/ContactSupportOutlined';
import DescriptionOutlined from '@material-ui/icons/DescriptionOutlined';
import EditOutlined from '@material-ui/icons/EditOutlined';
import HelpOutlineOutlined from '@material-ui/icons/HelpOutlineOutlined';
import PolicyOutlined from '@material-ui/icons/PolicyOutlined';
import SchoolOutlined from '@material-ui/icons/SchoolOutlined';
import ScoreOutlined from '@material-ui/icons/ScoreOutlined';
import StorageOutlined from '@material-ui/icons/StorageOutlined';
import SubjectOutlined from '@material-ui/icons/SubjectOutlined';
import UpdateOutlined from '@material-ui/icons/UpdateOutlined';
import VpnKeyOutlined from '@material-ui/icons/VpnKeyOutlined';

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
export const RESULTS_PER_PAGE_OPTIONS = [10, 25, 50, 75, 100];
export const PASSWORD_MIN_LENGTH = 10; // Should match with whatever backend is using.
export const DATE_PICKER_FORMAT = 'DD-MM-YYYY';
export const LS_LOGOUT_KEY = 'SKOLE_LOGOUT';
export const MAX_REVALIDATION_INTERVAL = 1; // Seconds.

export const DISALLOWED_PATHS = [
  '/404',
  urls.about,
  urls.activity,
  urls.addCourse,
  urls.changePassword,
  urls.deleteAccount,
  urls.editProfile,
  urls.logout,
  urls.myData,
  urls.search,
  urls.starred,
  urls.verifyAccount,
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
      icon: EditOutlined,
      text: 'common:editProfile',
      href: urls.editProfile,
    },
    {
      icon: VpnKeyOutlined,
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
      icon: VpnKeyOutlined,
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
    icon: HelpOutlineOutlined,
    text: 'common:guidelines',
    href: urls.guidelines,
  },
  {
    icon: ScoreOutlined,
    text: 'common:score',
    href: urls.score,
  },
  {
    icon: DescriptionOutlined,
    text: 'common:values',
    href: urls.values,
  },
  {
    icon: SubjectOutlined,
    text: 'common:blog',
    href: urls.blogs,
  },
  {
    icon: UpdateOutlined,
    text: 'common:updates',
    href: urls.updates,
  },
  {
    icon: PolicyOutlined,
    text: 'common:terms',
    href: urls.terms,
  },
  {
    icon: PolicyOutlined,
    text: 'common:privacy',
    href: urls.privacy,
  },
];
