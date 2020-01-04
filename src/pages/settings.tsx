import { Box, Button, CardContent, Divider, MenuItem, MenuList, Typography } from '@material-ui/core';
import { I18nPage, I18nProps, SkoleContext, State } from '../types';
import { Layout, SlimCardContent, StyledCard } from '../components';
import { Router, includeDefaultNamespaces } from '../i18n';
import { menuItems, useAuthSync } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { withApollo, withRedux } from '../lib';

import React from 'react';
import { TFunction } from 'next-i18next';
import { compose } from 'redux';
import { deAuthenticate } from '../actions';
import { useApolloClient } from 'react-apollo';
import { useTranslation } from 'react-i18next';

const SettingsPage: I18nPage = () => {
    const { authenticated } = useSelector((state: State) => state.auth);
    const apolloClient = useApolloClient();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const handleLanguageSelect = (value: string) => (): Promise<TFunction> => i18n.changeLanguage(value);
    const handleRedirect = (href: string) => (): Promise<boolean> => Router.push(href);

    const renderMenuSubHeader = (text: string): JSX.Element => (
        <Box marginLeft="1rem">
            <Typography variant="subtitle1" align="left" color="textSecondary">
                {t(text)}
            </Typography>
        </Box>
    );

    const renderAccountMenuItems = menuItems.account.map((m, i) => (
        <MenuItem key={i} onClick={handleRedirect(m.href)}>
            {t(m.text)}
        </MenuItem>
    ));

    const renderLanguageMenuItems = menuItems.language.map((m, i) => (
        <MenuItem key={i} onClick={handleLanguageSelect(m.value)}>
            {t(m.title)}
        </MenuItem>
    ));

    const renderAboutMenuItems = menuItems.about.map((m, i) => (
        <MenuItem key={i} onClick={handleRedirect(m.href)}>
            {t(m.text)}
        </MenuItem>
    ));

    const renderLegalItems = menuItems.legal.map((m, i) => (
        <MenuItem key={i} onClick={handleRedirect(m.href)}>
            {t(m.text)}
        </MenuItem>
    ));

    const renderAuthenticatedMenuList = (
        <MenuList>
            {renderMenuSubHeader('settings:account')}
            {renderAccountMenuItems}
            <Divider />
            {renderMenuSubHeader('common:language')}
            {renderLanguageMenuItems}
            <Divider />
            {renderMenuSubHeader('common:about')}
            {renderAboutMenuItems}
            <Divider />
            {renderMenuSubHeader('common:legal')}
            {renderLegalItems}
        </MenuList>
    );

    const renderUnAuthenticatedMenuList = (
        <MenuList>
            {renderMenuSubHeader('common:language')}
            {renderLanguageMenuItems}
            <Divider />
            {renderMenuSubHeader('common:about')}
            {renderAboutMenuItems}
            <Divider />
            {renderMenuSubHeader('common:legal')}
            {renderLegalItems}
        </MenuList>
    );

    const renderSignInButton = (
        <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={(): Promise<boolean> => Router.push('/auth/sign-in')}
        >
            {t('common:signIn')}
        </Button>
    );

    const renderSignOutButton = (
        <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={(): void => dispatch((deAuthenticate(apolloClient) as unknown) as void)}
        >
            {t('common:signOut')}
        </Button>
    );

    return (
        <Layout heading={t('settings:title')} title={t('settings:title')} backUrl>
            <StyledCard>
                <CardContent>{authenticated ? renderAuthenticatedMenuList : renderUnAuthenticatedMenuList}</CardContent>
                <Divider />
                <SlimCardContent>{authenticated ? renderSignOutButton : renderSignInButton}</SlimCardContent>
            </StyledCard>
        </Layout>
    );
};

SettingsPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['settings']) };
};

export default compose(withApollo, withRedux)(SettingsPage);
