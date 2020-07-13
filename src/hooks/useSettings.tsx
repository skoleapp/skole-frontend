import { useApolloClient } from '@apollo/react-hooks';
import { Box, ListItemText, MenuItem } from '@material-ui/core';
import { ExitToAppOutlined, HowToRegOutlined, LanguageOutlined, VerifiedUserOutlined } from '@material-ui/icons';
import { StyledList } from 'components';
import { useAuthContext, useNotificationsContext, useSettingsContext } from 'context';
import { Router } from 'i18n';
import { removeTokenCookie } from 'lib';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsContext } from 'types';
import { MENU_ITEMS, urls } from 'utils';

import { useLanguageSelector } from './useLanguageSelector';

interface UseSettings extends SettingsContext {
    renderSettingsMenuList: JSX.Element;
}

// A hook for rendering the common settings menu components.
// The modal prop indicates whether this hook is used with the modal or with the settings layout.
export const useSettings = (modal: boolean): UseSettings => {
    const { userMe, verified } = useAuthContext();
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
        await removeTokenCookie(); // We need to wait until the asynchronous middleware for removing the cookie has been called before the response is sent to the client.
        toggleNotification(t('notifications:signedOut'));
        await apolloClient.resetStore();
        Router.push(urls.login);
    };

    const getSelected = (href: string): boolean => !modal && href === pathname;

    const handleLanguageClick = (): void => {
        handleClose();
        openLanguageMenu();
    };

    const renderAccountMenuItems = MENU_ITEMS.account.map(({ icon: Icon, href, text }, i) => (
        <MenuItem key={i} onClick={handleMenuItemClick(href)} selected={getSelected(href)}>
            <ListItemText>
                <Icon /> {t(text)}
            </ListItemText>
        </MenuItem>
    ));

    const renderVerifyAccountMenuItem = verified === false && (
        <MenuItem onClick={handleMenuItemClick(urls.verifyAccount)} selected={getSelected(urls.verifyAccount)}>
            <ListItemText>
                <VerifiedUserOutlined /> {t('common:verifyAccount')}
            </ListItemText>
        </MenuItem>
    );

    const renderCommonAccountMenuItems = MENU_ITEMS.commonAccount.map(({ icon: Icon, href, text }, i) => (
        <MenuItem key={i} onClick={handleMenuItemClick(href)} selected={getSelected(href)}>
            <ListItemText>
                <Icon /> {t(text)}
            </ListItemText>
        </MenuItem>
    ));

    const renderAboutMenuItems = MENU_ITEMS.about.map(({ icon: Icon, href, text }, i) => (
        <MenuItem key={i} onClick={handleMenuItemClick(href)} selected={getSelected(href)}>
            <ListItemText>
                <Icon /> {t(text)}
            </ListItemText>
        </MenuItem>
    ));

    const renderLegalItems = MENU_ITEMS.legal.map(({ icon: Icon, href, text }, i) => (
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
        <MenuItem onClick={handleMenuItemClick(urls.login)}>
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
        <Box flexGrow="1">{!!userMe ? renderAuthenticatedMenuList : renderCommonMenuItems}</Box>
    );

    return { renderSettingsMenuList, settingsOpen, toggleSettings };
};
