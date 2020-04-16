import { Box, Button, MenuItem } from '@material-ui/core';
import { ExitToAppOutlined } from '@material-ui/icons';
import { useRouter } from 'next/router';
import React from 'react';

import { StyledList } from '../components/shared/StyledList';
import { useNotificationsContext, useSettingsContext } from '../context';
import { useTranslation } from '../i18n';
import { Router } from '../i18n';
import { useAuth } from '../lib';
import { Settings } from '../types';
import { menuItems } from './menuItems';
import { useLanguageSelector } from './useLanguageSelector';

interface UseSettings extends Settings {
    renderSettingsCardContent: JSX.Element;
}

interface Props {
    modal: boolean;
}

// A hook for rendering the common settings menu components.
// The modal prop indicates whether this hook is used with the modal or with the settings layout.
export const useSettings = ({ modal }: Props): UseSettings => {
    const { user } = useAuth();
    const authenticated = !!user;
    const { settingsOpen, toggleSettings } = useSettingsContext();
    const { toggleNotification } = useNotificationsContext();
    const { t } = useTranslation();
    const { pathname } = useRouter();
    const { renderCurrentFlag, openLanguageMenu } = useLanguageSelector();
    const { logout } = useAuth();

    const handleClose = (): void => {
        toggleSettings(false);
    };

    const handleMenuItemClick = (href: string) => (): void => {
        !!modal && handleClose();
        Router.push(href);
    };

    const handleLogoutClick = (): void => {
        !!modal && handleClose();
        logout();
        toggleNotification(t('notifications:signedOut'));
    };

    const getSelected = (m: { [key: string]: string }): boolean => !modal && m.href === pathname;

    const handleLanguageClick = (): void => {
        handleClose();
        openLanguageMenu();
    };

    const renderAccountMenuItems = menuItems.account.map((m, i) => (
        <MenuItem key={i} onClick={handleMenuItemClick(m.href)} selected={getSelected(m)}>
            {t(m.text)}
        </MenuItem>
    ));

    const renderAboutMenuItems = menuItems.about.map((m, i) => (
        <MenuItem key={i} onClick={handleMenuItemClick(m.href)} selected={getSelected(m)}>
            {t(m.text)}
        </MenuItem>
    ));

    const renderLegalItems = menuItems.legal.map((m, i) => (
        <MenuItem key={i} onClick={handleMenuItemClick(m.href)} selected={getSelected(m)}>
            {t(m.text)}
        </MenuItem>
    ));

    const renderLanguageMenuItem = (
        <MenuItem onClick={handleLanguageClick}>
            {t('common:language')} {renderCurrentFlag}
        </MenuItem>
    );

    const renderCommonMenuItems = (
        <StyledList>
            {renderLanguageMenuItem}
            {renderAboutMenuItems}
            {renderLegalItems}
        </StyledList>
    );

    const renderAuthenticatedMenuList = (
        <StyledList>
            {renderAccountMenuItems}
            {renderLanguageMenuItem}
            {renderAboutMenuItems}
            {renderLegalItems}
        </StyledList>
    );

    const renderLoginButton = (
        <Button fullWidth variant="outlined" color="primary" onClick={handleMenuItemClick('/login')}>
            {t('common:login')}
        </Button>
    );

    const renderLogoutButton = (
        <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={handleLogoutClick}
            endIcon={<ExitToAppOutlined />}
        >
            {t('common:logout')}
        </Button>
    );

    const renderSettingsCardContent = (
        <Box flexGrow="1" display="flex" flexDirection="column" justifyContent="space-between">
            {authenticated ? renderAuthenticatedMenuList : renderCommonMenuItems}
            <Box padding="0.5rem">{authenticated ? renderLogoutButton : renderLoginButton}</Box>
        </Box>
    );

    return { renderSettingsCardContent, settingsOpen, toggleSettings };
};
