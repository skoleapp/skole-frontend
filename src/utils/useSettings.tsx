import { useApolloClient } from '@apollo/react-hooks';
import { Box, ListItemText, MenuItem } from '@material-ui/core';
import {
    AssignmentOutlined,
    ContactSupportOutlined,
    DeleteForeverOutlined,
    EditOutlined,
    ExitToAppOutlined,
    HelpOutlineOutlined,
    HowToRegOutlined,
    LanguageOutlined,
    LockOutlined,
    QuestionAnswerOutlined,
    SecurityOutlined,
    SettingsBackupRestoreOutlined,
    StarBorderOutlined,
    VerifiedUserOutlined,
} from '@material-ui/icons';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';

import { StyledList } from '../components/shared/StyledList';
import { useAuthContext, useNotificationsContext, useSettingsContext } from '../context';
import { useTranslation } from '../i18n';
import { Router } from '../i18n';
import { clientLogout } from '../lib';
import { SettingsContext } from '../types';
import { useLanguageSelector } from './useLanguageSelector';

export const menuItems = {
    account: [
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

interface UseSettings extends SettingsContext {
    renderSettingsMenuList: JSX.Element;
}

// A hook for rendering the common settings menu components.
// The modal prop indicates whether this hook is used with the modal or with the settings layout.
export const useSettings = (modal: boolean): UseSettings => {
    const { user, setUser } = useAuthContext();
    const verified = R.propOr(null, 'verified', user);
    const authenticated = !!user;
    const { settingsOpen, toggleSettings } = useSettingsContext();
    const { toggleNotification } = useNotificationsContext();
    const { t } = useTranslation();
    const { pathname } = useRouter();
    const { openLanguageMenu } = useLanguageSelector();
    const apolloClient = useApolloClient();

    const handleClose = (): void => {
        toggleSettings(false);
    };

    const handleMenuItemClick = (href: string) => (): void => {
        !!modal && handleClose();
        Router.push(href);
    };

    const handleLogoutClick = async (): Promise<void> => {
        !!modal && handleClose();
        clientLogout();
        setUser(null);
        await apolloClient.resetStore();
        Router.push('/login');
        toggleNotification(t('notifications:signedOut'));
    };

    const getSelected = (href: string): boolean => !modal && href === pathname;

    const handleLanguageClick = (): void => {
        handleClose();
        openLanguageMenu();
    };

    const renderAccountMenuItems = menuItems.account.map(({ icon: Icon, href, text }, i) => (
        <MenuItem key={i} onClick={handleMenuItemClick(href)} selected={getSelected(href)}>
            <ListItemText>
                <Icon /> {t(text)}
            </ListItemText>
        </MenuItem>
    ));

    const renderVerifyAccountMenuItem = verified === false && (
        <MenuItem
            onClick={handleMenuItemClick('/account/verify-account')}
            selected={getSelected('/account/verify-account')}
        >
            <ListItemText>
                <VerifiedUserOutlined /> {t('common:verifyAccount')}
            </ListItemText>
        </MenuItem>
    );

    const renderCommonAccountMenuItems = menuItems.commonAccount.map(({ icon: Icon, href, text }, i) => (
        <MenuItem key={i} onClick={handleMenuItemClick(href)} selected={getSelected(href)}>
            <ListItemText>
                <Icon /> {t(text)}
            </ListItemText>
        </MenuItem>
    ));

    const renderAboutMenuItems = menuItems.about.map(({ icon: Icon, href, text }, i) => (
        <MenuItem key={i} onClick={handleMenuItemClick(href)} selected={getSelected(href)}>
            <ListItemText>
                <Icon /> {t(text)}
            </ListItemText>
        </MenuItem>
    ));

    const renderLegalItems = menuItems.legal.map(({ icon: Icon, href, text }, i) => (
        <MenuItem key={i} onClick={handleMenuItemClick(href)} selected={getSelected(href)}>
            <ListItemText>
                <Icon /> {t(text)}
            </ListItemText>
        </MenuItem>
    ));

    const renderLanguageMenuItem = (
        <MenuItem onClick={handleLanguageClick}>
            <ListItemText>
                <LanguageOutlined /> {t('common:language')}
            </ListItemText>
        </MenuItem>
    );

    const renderLoginMenuItem = (
        <MenuItem onClick={handleMenuItemClick('/login')}>
            <ListItemText>
                <HowToRegOutlined /> {t('common:login')}
            </ListItemText>
        </MenuItem>
    );

    const renderLogoutMenuItem = (
        <MenuItem onClick={handleLogoutClick}>
            <ListItemText>
                <ExitToAppOutlined /> {t('common:logout')}
            </ListItemText>
        </MenuItem>
    );

    const renderCommonMenuItems = (
        <StyledList>
            {renderCommonAccountMenuItems}
            {renderLanguageMenuItem}
            {renderAboutMenuItems}
            {renderLegalItems}
            {renderLoginMenuItem}
        </StyledList>
    );

    const renderAuthenticatedMenuList = (
        <StyledList>
            {renderAccountMenuItems}
            {renderVerifyAccountMenuItem}
            {renderLanguageMenuItem}
            {renderAboutMenuItems}
            {renderLegalItems}
            {renderLogoutMenuItem}
        </StyledList>
    );

    const renderSettingsMenuList = (
        <Box flexGrow="1">{authenticated ? renderAuthenticatedMenuList : renderCommonMenuItems}</Box>
    );

    return { renderSettingsMenuList, settingsOpen, toggleSettings };
};
