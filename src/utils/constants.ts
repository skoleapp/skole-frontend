import {
    AssignmentOutlined,
    CloudUploadOutlined,
    ContactSupportOutlined,
    DeleteForeverOutlined,
    EditOutlined,
    HelpOutlineOutlined,
    LibraryAddOutlined,
    LockOutlined,
    NotificationsOutlined,
    QuestionAnswerOutlined,
    SchoolOutlined,
    SecurityOutlined,
    SettingsBackupRestoreOutlined,
    StarBorderOutlined,
} from '@material-ui/icons';

import { urls } from './urls';

// Token cookie.

export const TOKEN_NAME = 'JWT';
export const MAX_AGE = 60 * 60 * 24 * 30; // 1 month.

// Analytics.

export const GA_TRACKING_ID = 'UA-159917631-1';

// PDF Viewer.

export const DEFAULT_TRANSLATION = { x: 0, y: 0 };
export const DEFAULT_SCALE = 1.0;
export const MIN_SCALE = 0.75;
export const MAX_SCALE = 1.75;

// Landing page shortcuts.

export const SHORTCUTS = [
    {
        text: 'index:browseCourses',
        icon: SchoolOutlined,
        href: urls.search,
    },
    {
        text: 'index:uploadResource',
        icon: CloudUploadOutlined,
        href: urls.uploadResource,
    },
    {
        text: 'index:createCourse',
        icon: LibraryAddOutlined,
        href: urls.createCourse,
    },
];

// Settings.

export const MENU_ITEMS = {
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
            icon: DeleteForeverOutlined,
            text: 'common:deleteAccount',
            href: urls.deleteAccount,
        },
    ],
    commonAccount: [
        {
            icon: SettingsBackupRestoreOutlined,
            text: 'common:resetPassword',
            href: urls.resetPassword,
        },
    ],
    language: [
        {
            title: 'languages:english',
            value: 'en',
        },
        {
            title: 'languages:finnish',
            value: 'fi',
        },
        {
            title: 'languages:swedish',
            value: 'sv',
        },
    ],
    about: [
        {
            icon: HelpOutlineOutlined,
            text: 'common:about',
            href: urls.about,
        },
        {
            icon: ContactSupportOutlined,
            text: 'common:contact',
            href: urls.contact,
        },
        {
            icon: QuestionAnswerOutlined,
            text: 'common:faq',
            href: urls.faq,
        },
    ],
    legal: [
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

// FAQ items.

export const FAQ_ITEMS = [
    {
        title: 'faq:title-1',
        text: 'faq:text-1',
    },
    {
        title: 'faq:title-2',
        text: 'faq:text-2',
    },
    {
        title: 'faq:title-3',
        text: 'faq:text-3',
    },
];

// Rich text editor.

export const RICH_STYLES = {
    bold: 'BOLD',
    italic: 'ITALIC',
    strikeThrough: 'STRIKETHROUGH',
    link: 'link-entity',
    orderedList: 'ordered-list-item',
    unorderedList: 'unordered-list-item',
    blockQuote: 'blockquote',
    codeBlock: 'code-block',
};
