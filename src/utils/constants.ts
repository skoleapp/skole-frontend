import {
  AssignmentOutlined,
  ContactSupportOutlined,
  EditOutlined,
  LockOutlined,
  NotificationsOutlined,
  SecurityOutlined,
  SettingsBackupRestoreOutlined,
  StarBorderOutlined,
} from '@material-ui/icons';

import { urls } from './urls';

export const TOKEN_NAME = 'JWT';
export const MAX_AGE = 60 * 60 * 24 * 30; // 1 month.
export const DEFAULT_TRANSLATION = { x: 0, y: 0 };
export const DEFAULT_SCALE = 1.0;
export const MIN_SCALE = 0.75;
export const MAX_SCALE = 1.75;
export const GET_STARTED_PAGE_VISITED_KEY = 'get-started-page-visited';
export const ACCEPTED_FILES = ['image/*', 'text/*', 'application/*'];
export const MAX_FILE_SIZE = 10000000;
export const AVATAR_MAX_FILE_SIZE = 2000000;
export const RESULTS_PER_PAGE_OPTIONS = [25, 50, 75, 100];

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
  codeBlock: 'code-block',
};
