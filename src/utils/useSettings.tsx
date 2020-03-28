import { Button, Divider, ListItem, ListSubheader, MenuItem } from '@material-ui/core';
import { ExitToAppOutlined } from '@material-ui/icons';
import { useRouter } from 'next/router';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch, useSelector } from 'react-redux';

import { deAuthenticate, toggleSettings } from '../actions';
import { StyledList } from '../components/shared/StyledList';
import { useTranslation } from '../i18n';
import { Router } from '../i18n';
import { State } from '../types';
import { menuItems } from '.';
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
    const { authenticated } = useSelector((state: State) => state.auth);
    const apolloClient = useApolloClient();
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
        dispatch((deAuthenticate(apolloClient) as unknown) as void);
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
            <ListSubheader>{t('common:about')}</ListSubheader>
            {renderAboutMenuItems}
            <Divider />
            <ListSubheader>{t('common:legal')}</ListSubheader>
            {renderLegalItems}
        </StyledList>
    );

    const renderAuthenticatedMenuList = (
        <StyledList>
            <ListSubheader>{t('common:account')}</ListSubheader>
            {renderAccountMenuItems}
            <Divider />
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
