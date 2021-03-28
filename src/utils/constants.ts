import AccountCircleOutlined from '@material-ui/icons/AccountCircleOutlined';
import ContactSupportOutlined from '@material-ui/icons/ContactSupportOutlined';
import DescriptionOutlined from '@material-ui/icons/DescriptionOutlined';
import EditOutlined from '@material-ui/icons/EditOutlined';
import HelpOutlineOutlined from '@material-ui/icons/HelpOutlineOutlined';
import PolicyOutlined from '@material-ui/icons/PolicyOutlined';
import ScoreOutlined from '@material-ui/icons/ScoreOutlined';
import VpnKeyOutlined from '@material-ui/icons/VpnKeyOutlined';

import { urls } from './urls';

export const LANGUAGES = [
  { label: 'languages:english', value: 'en' },
  { label: 'languages:finnish', value: 'fi' },
  { label: 'languages:swedish', value: 'sv' },
];

export const ACCEPTED_COMMENT_IMAGE_FILES = ['image/*'];
export const ACCEPTED_AVATAR_FILES = ['image/*'];
export const MAX_AVATAR_WIDTH_HEIGHT = 200; // Pixels.
export const MAX_IMAGE_FILE_SIZE = 3500000; // 3.5 MB.
export const MAX_IMAGE_WIDTH_HEIGHT = 1200; // Pixels.
export const RESULTS_PER_PAGE_OPTIONS = [25, 50, 75, 100];
export const PASSWORD_MIN_LENGTH = 10; // Should match with whatever backend is using.
export const DATE_PICKER_FORMAT = 'DD-MM-YYYY';
export const LS_LOGOUT_KEY = 'SKOLE_LOGOUT';
export const MAX_REVALIDATION_INTERVAL = 1; // Seconds.

export const LOCALE_PATHS = ['', '/fi', '/sv'];

export const DEFAULT_NAMESPACES = [
  'common',
  'error',
  'not-found',
  'languages',
  'forms',
  'validation',
  'common-tooltips',
  'activity',
  'offline',
  'sharing',
  'alt-texts',
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
      icon: AccountCircleOutlined,
      text: 'common:accountSettings',
      href: urls.accountSettings,
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

export const SCHOOL_LOGOS = [
  {
    name: 'utu.png',
    alt: 'University of Turku',
  },
  {
    name: 'abo-akademi.png',
    alt: 'Abo Akademi',
  },
  {
    name: 'aalto-uni.png',
    alt: 'Aalto University',
  },
  {
    name: 'helsinki-uni.png',
    alt: 'University of Helsinki',
  },
  {
    name: 'tampere-uni.png',
    alt: 'Tampere University',
  },
  {
    name: 'lut-uni.png',
    alt: 'LUT University',
  },
  {
    name: 'jyu.png',
    alt: 'University of Jyväskylä',
  },
  {
    name: 'hanken.png',
    alt: 'Hanken Svenska handelshögskolan',
  },
  {
    name: 'oulu-uni.png',
    alt: 'University of Oulu',
  },
  {
    name: 'vaasa-uni.png',
    alt: 'University of Vaasa',
  },
  {
    name: 'eastern-finland-uni.png',
    alt: 'University of Eastern Finland',
  },
  {
    name: 'lapland-uni.png',
    alt: 'University of Lapland',
  },
  {
    name: 'mpkk.png',
    alt: 'Maanpuolustuskorkeakoulu',
  },
  {
    name: 'uniarts.png',
    alt: 'Uniarts Helsinki',
  },
];
