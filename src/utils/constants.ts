import {
  AssignmentOutlined,
  ContactSupportOutlined,
  EditOutlined,
  LockOutlined,
  MessageOutlined,
  NotificationsOutlined,
  SchoolOutlined,
  ScoreOutlined,
  SecurityOutlined,
  SettingsBackupRestoreOutlined,
  StarBorderOutlined,
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
export const ACCEPTED_RESOURCE_FILES = ['image/*', 'text/*', 'application/*'];
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
    subheader: 'get-started:coursesPitchSubheader',
    icon: SchoolOutlined,
    text: 'get-started:coursesPitchText',
  },
  {
    subheader: 'get-started:materialsPitchSubheader',
    icon: AssignmentOutlined,
    text: 'get-started:materialsPitchText',
  },
  {
    subheader: 'get-started:discussionPitchSubheader',
    icon: MessageOutlined,
    text: 'get-started:discussionPitchText',
  },
  {
    subheader: 'get-started:scorePitchSubheader',
    icon: ScoreOutlined,
    text: 'get-started:scorePitchText',
  },
];

export const SETTINGS_ITEMS = {
  account: [
    {
      icon: NotificationsOutlined,
      text: 'common:activity',
      href: urls.activity,
    },
    {
      icon: StarBorderOutlined,
      text: 'common:starred',
      href: urls.starred,
    },
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

export const RICH_TEXT_EDITOR_STYLES = {
  bold: 'BOLD',
  italic: 'ITALIC',
  strikeThrough: 'STRIKETHROUGH',
  link: 'link-entity',
  orderedList: 'ordered-list-item',
  unorderedList: 'unordered-list-item',
  blockQuote: 'blockquote',
};
