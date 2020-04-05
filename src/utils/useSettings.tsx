import { Button, Divider, ListItem, MenuItem } from '@material-ui/core';
import { ExitToAppOutlined } from '@material-ui/icons';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';

import { toggleNotification, toggleSettings } from '../actions';
import { StyledList } from '../components/shared/StyledList';
import { useTranslation } from '../i18n';
import { Router } from '../i18n';
import { menuItems } from '.';
import { getUser, logout } from './auth';
import { useLanguageSelector } from './useLanguageSelector';

interface UseSettings {
    renderSettingsCardContent: JSX.Element;
}

interface Props {
    modal: boolean;
}

// A hook for rendering the common settings menu components.
// The modal prop indicates whether this hook is used with the modal or with the settings layout.
export const useSettings = ({ modal }: Props): UseSettings => {
    const authenticated = !!getUser();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { pathname } = useRouter();
    const { renderCurrentFlag, openLanguageMenu } = useLanguageSelector();

    const handleClose = (): void => {
        dispatch(toggleSettings(false));
    };

    const handleMenuItemClick = (href: string) => (): void => {
        !!modal && handleClose();
        Router.push(href);
    };

    const handleLogoutClick = (): void => {
        !!modal && handleClose();
        logout();
        dispatch(toggleNotification(t('notifications:signedOut')));
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
        <ListItem>
            <Button fullWidth variant="outlined" color="primary" onClick={handleMenuItemClick('/login')}>
                {t('common:login')}
            </Button>
        </ListItem>
    );

    const renderLogoutButton = (
        <ListItem>
            <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={handleLogoutClick}
                endIcon={<ExitToAppOutlined />}
            >
                {t('common:logout')}
            </Button>
        </ListItem>
    );

    const renderSettingsCardContent = (
        <>
            {authenticated ? renderAuthenticatedMenuList : renderCommonMenuItems}
            <Divider />
            {authenticated ? renderLogoutButton : renderLoginButton}
        </>
    );

    return { renderSettingsCardContent };
};
