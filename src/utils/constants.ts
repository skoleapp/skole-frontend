import {
    AssignmentOutlined,
    ContactSupportOutlined,
    DeleteForeverOutlined,
    EditOutlined,
    HelpOutlineOutlined,
    LockOutlined,
    NotificationsOutlined,
    QuestionAnswerOutlined,
    SecurityOutlined,
    SettingsBackupRestoreOutlined,
    StarBorderOutlined,
} from '@material-ui/icons';

export const menuItems = {
    account: [
        {
            icon: NotificationsOutlined,
            text: 'common:activity',
            href: '/account/activity',
        },
        {
            icon: StarBorderOutlined,
            text: 'common:starred',
            href: '/account/starred',
        },
        {
            icon: EditOutlined,
            text: 'common:editProfile',
            href: '/account/edit-profile',
        },
        {
            icon: LockOutlined,
            text: 'common:changePassword',
            href: '/account/change-password',
        },
        {
            icon: DeleteForeverOutlined,
            text: 'common:deleteAccount',
            href: '/account/delete-account',
        },
    ],
    commonAccount: [
        {
            icon: SettingsBackupRestoreOutlined,
            text: 'common:resetPassword',
            href: '/account/reset-password',
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
            href: '/about',
        },
        {
            icon: ContactSupportOutlined,
            text: 'common:contact',
            href: '/contact',
        },
        {
            icon: QuestionAnswerOutlined,
            text: 'common:faq',
            href: '/faq',
        },
    ],
    legal: [
        {
            icon: AssignmentOutlined,
            text: 'common:terms',
            href: '/terms',
        },
        {
            icon: SecurityOutlined,
            text: 'common:privacy',
            href: '/privacy',
        },
    ],
};
