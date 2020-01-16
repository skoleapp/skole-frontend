import { Button, Divider, ListItem, ListSubheader, MenuItem } from '@material-ui/core';
import { LanguageSelector, StyledMenuList } from '../components';
import { deAuthenticate, toggleSettings } from '../actions';
import { useDispatch, useSelector } from 'react-redux';

import React from 'react';
import { Router } from '../i18n';
import { State } from '../types';
import { menuItems } from '.';
import { useApolloClient } from 'react-apollo';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

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

    const handleMenuItemClick = (href: string) => (): void => {
        !!modal && dispatch(toggleSettings(false));
        Router.push(href);
    };

    const handleSignOutClick = (): void => {
        !!modal && dispatch(toggleSettings(false));
        dispatch((deAuthenticate(apolloClient) as unknown) as void);
    };

    const getSelected = (m: { [key: string]: string }): boolean => !modal && m.href === pathname;

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

    const renderCommonMenuItems = (
        <>
            <ListSubheader>{t('common:language')}</ListSubheader>
            <ListItem>
                <LanguageSelector fullWidth />;
            </ListItem>
            <Divider />
            <ListSubheader>{t('common:about')}</ListSubheader>
            {renderAboutMenuItems}
            <Divider />
            <ListSubheader>{t('common:legal')}</ListSubheader>
            {renderLegalItems}
        </>
    );

    const renderAuthenticatedMenuList = (
        <StyledMenuList>
            <ListSubheader>{t('common:account')}</ListSubheader>
            {renderAccountMenuItems}
            <Divider />
            {renderCommonMenuItems}
        </StyledMenuList>
    );

    const renderSignInButton = (
        <ListItem>
            <Button fullWidth variant="outlined" color="primary" onClick={handleMenuItemClick('/sign-in')}>
                {t('common:signIn')}
            </Button>
        </ListItem>
    );

    const renderSignOutButton = (
        <ListItem>
            <Button fullWidth variant="outlined" color="primary" onClick={handleSignOutClick}>
                {t('common:signOut')}
            </Button>
        </ListItem>
    );

    const renderSettingsCardContent = (
        <>
            {authenticated ? renderAuthenticatedMenuList : <StyledMenuList>{renderCommonMenuItems}</StyledMenuList>}
            <Divider />
            {authenticated ? renderSignOutButton : renderSignInButton}
        </>
    );

    return { renderSettingsCardContent };
};
