import { Box, Button, CardContent, Divider, ListItem, MenuItem, Typography } from '@material-ui/core';
import { FormGridContainer, LanguageSelector, Layout, StyledCard, StyledMenuList } from '../components';
import { I18nPage, I18nProps, SkoleContext, State } from '../types';
import { Router, includeDefaultNamespaces } from '../i18n';
import { menuItems, useAuthSync } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { withApollo, withRedux } from '../lib';

import React from 'react';
import { compose } from 'redux';
import { deAuthenticate } from '../actions';
import { useApolloClient } from 'react-apollo';
import { useTranslation } from 'react-i18next';

const SettingsPage: I18nPage = () => {
    const { authenticated } = useSelector((state: State) => state.auth);
    const apolloClient = useApolloClient();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const handleRedirect = (href: string) => (): Promise<boolean> => Router.push(href);

    const renderMenuSubHeader = (text: string): JSX.Element => (
        <Box margin="0.25rem 1rem">
            <Typography className="sub-header" variant="subtitle1" align="left" color="textSecondary">
                {t(text)}
            </Typography>
        </Box>
    );

    const renderAccountMenuItems = menuItems.account.map((m, i) => (
        <MenuItem key={i} onClick={handleRedirect(m.href)}>
            {t(m.text)}
        </MenuItem>
    ));

    const renderLanguage = (
        <ListItem>
            <LanguageSelector fullWidth />;
        </ListItem>
    );

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
        <StyledMenuList>
            {renderMenuSubHeader('settings:account')}
            {renderAccountMenuItems}
            <Divider />
            {renderMenuSubHeader('common:language')}
            {renderLanguage}
            <Divider />
            {renderMenuSubHeader('common:about')}
            {renderAboutMenuItems}
            <Divider />
            {renderMenuSubHeader('common:legal')}
            {renderLegalItems}
        </StyledMenuList>
    );

    const renderUnAuthenticatedMenuList = (
        <StyledMenuList>
            {renderMenuSubHeader('common:language')}
            {renderLanguage}
            <Divider />
            {renderMenuSubHeader('common:about')}
            {renderAboutMenuItems}
            <Divider />
            {renderMenuSubHeader('common:legal')}
            {renderLegalItems}
        </StyledMenuList>
    );

    const renderSignInButton = (
        <ListItem>
            <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={(): Promise<boolean> => Router.push('/sign-in')}
            >
                {t('common:signIn')}
            </Button>
        </ListItem>
    );

    const renderSignOutButton = (
        <ListItem>
            <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={(): void => dispatch((deAuthenticate(apolloClient) as unknown) as void)}
            >
                {t('common:signOut')}
            </Button>
        </ListItem>
    );

    return (
        <Layout heading={t('settings:title')} title={t('settings:title')} backUrl>
            <StyledCard>
                <FormGridContainer>
                    <CardContent>
                        {authenticated ? renderAuthenticatedMenuList : renderUnAuthenticatedMenuList}
                        <Divider />
                        {authenticated ? renderSignOutButton : renderSignInButton}
                    </CardContent>
                </FormGridContainer>
            </StyledCard>
        </Layout>
    );
};

SettingsPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['settings']) };
};

export default compose(withApollo, withRedux)(SettingsPage);
