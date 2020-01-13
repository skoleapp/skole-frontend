import { Box, Button, CardContent, CardHeader, Divider, Grid, ListItem, MenuItem, Typography } from '@material-ui/core';
import { LanguageSelector, Layout, StyledCard, StyledMenuList } from '../components';
import { useDispatch, useSelector } from 'react-redux';

import React from 'react';
import { Router } from '../i18n';
import { State } from '../types';
import { deAuthenticate } from '../actions';
import { menuItems } from './menuItems';
import { useApolloClient } from 'react-apollo';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

interface Props {
    title: string;
    renderCardContent: JSX.Element;
}

export const useSettingsLayout = ({ title, renderCardContent }: Props): JSX.Element => {
    const { authenticated } = useSelector((state: State) => state.auth);
    const apolloClient = useApolloClient();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { pathname } = useRouter();
    const handleRedirect = (href: string) => (): Promise<boolean> => Router.push(href);

    const renderMenuSubHeader = (text: string): JSX.Element => (
        <Box margin="0.25rem 1rem">
            <Typography className="sub-header" variant="subtitle1" align="left" color="textSecondary">
                {t(text)}
            </Typography>
        </Box>
    );

    const renderAccountMenuItems = menuItems.account.map((m, i) => (
        <MenuItem key={i} onClick={handleRedirect(m.href)} selected={m.href === pathname}>
            {t(m.text)}
        </MenuItem>
    ));

    const renderLanguage = (
        <ListItem>
            <LanguageSelector fullWidth />;
        </ListItem>
    );

    const renderAboutMenuItems = menuItems.about.map((m, i) => (
        <MenuItem key={i} onClick={handleRedirect(m.href)} selected={m.href === pathname}>
            {t(m.text)}
        </MenuItem>
    ));

    const renderLegalItems = menuItems.legal.map((m, i) => (
        <MenuItem key={i} onClick={handleRedirect(m.href)} selected={m.href === pathname}>
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

    const renderMobileContent = (
        <StyledCard className="md-down">
            <CardHeader title={title} />
            <CardContent>{renderCardContent}</CardContent>
        </StyledCard>
    );

    const renderDesktopContent = (
        <StyledCard className="md-up">
            <Grid container>
                <Grid item xs={4} lg={3}>
                    <CardContent>
                        {authenticated ? renderAuthenticatedMenuList : renderUnAuthenticatedMenuList}
                        <Divider />
                        {authenticated ? renderSignOutButton : renderSignInButton}
                    </CardContent>
                </Grid>
                <Grid item xs={8} lg={9} container justify="center">
                    <Grid item xs={12} sm={8} md={6} lg={5}>
                        <CardHeader title={title} />
                        <CardContent>{renderCardContent}</CardContent>
                    </Grid>
                </Grid>
            </Grid>
        </StyledCard>
    );

    return (
        <Layout title={title} backUrl>
            {renderMobileContent}
            {renderDesktopContent}
        </Layout>
    );
};
