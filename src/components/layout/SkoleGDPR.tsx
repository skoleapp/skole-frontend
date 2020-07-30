import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Typography,
} from '@material-ui/core';
import { CheckOutlined } from '@material-ui/icons';
import cookie from 'cookie';
import { useTranslation } from 'lib';
import { useEffect, useState } from 'react';
import React from 'react';
import styled from 'styled-components';
import { breakpoints } from 'styles';
import { urls } from 'utils';

import { TextLink } from '..';

export const SkoleGDPR: React.FC = () => {
    const [consent, setConsent] = useState(true);
    const [privacyPreferencesOpen, setPrivacyPreferencesOpen] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const skoleGDPRConsent = cookie.parse(document.cookie).skole_gdpr_consent;
        !skoleGDPRConsent && setConsent(false);
    }, []);

    const handleConsent = (): void => {
        const value = new Date().toString();

        document.cookie = cookie.serialize('skole_gdpr_consent', value, {
            maxAge: 30 * 24 * 60 * 60 * 12, // 1 year
            path: '/',
        });

        setConsent(true);
    };

    const openPrivacyPreferences = (): void => setPrivacyPreferencesOpen(true);
    const closePrivacyPreferences = (): void => setPrivacyPreferencesOpen(false);

    const savePrivacyPreferences = (): void => {
        closePrivacyPreferences();
        handleConsent();
    };

    const renderWarning = (
        <Grid container justify="center" alignItems="center">
            <Grid item xs={12} md={8}>
                {t('gdpr:warningDesc')}
            </Grid>
            <Grid item container xs={12} md={4} justify="space-evenly" alignItems="center">
                <Button onClick={openPrivacyPreferences} color="secondary" fullWidth>
                    {t('gdpr:privacyPreferences')}
                </Button>
                <Button onClick={handleConsent} endIcon={<CheckOutlined />} variant="contained" fullWidth>
                    {t('common:confirm')}
                </Button>
            </Grid>
        </Grid>
    );

    const renderPrivacyPreferences = (
        <Dialog open={privacyPreferencesOpen} onClose={closePrivacyPreferences}>
            <DialogTitle>Privacy Preferences</DialogTitle>
            <DialogContent>
                <Box textAlign="left">
                    <Typography variant="subtitle1" gutterBottom>
                        {t('gdpr:consentManagement')}
                    </Typography>
                    <DialogContentText>{t('gdpr:consentManagementDesc')}</DialogContentText>
                </Box>
                <Box textAlign="left">
                    <Typography variant="subtitle1" gutterBottom>
                        {t('gdpr:privacyPolicy')}
                    </Typography>
                    <DialogContentText>
                        {t('gdpr:privacyPolicyDesc')} <TextLink href={urls.privacy}>{t('gdpr:privacyPolicy')}</TextLink>
                        .
                    </DialogContentText>
                </Box>
                <Box textAlign="left">
                    <Typography variant="subtitle1" gutterBottom>
                        {t('gdpr:termsAndConditions')}
                    </Typography>
                    <DialogContentText>
                        {t('gdpr:termsAndConditionsDesc')}{' '}
                        <TextLink href={urls.terms}>{t('gdpr:termsAndConditions')}</TextLink>.
                    </DialogContentText>
                </Box>
                <Box textAlign="left">
                    <Typography variant="subtitle1" gutterBottom>
                        {t('gdpr:cookieSettings')}
                    </Typography>
                    <DialogContentText>{t('gdpr:cookieSettingsDesc')}</DialogContentText>
                    <DialogContentText>{t('gdpr:cookies')}: token, csrftoken, skole_gdpr_consent</DialogContentText>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={savePrivacyPreferences} variant="contained" color="primary" autoFocus>
                    {t('common:save')}
                </Button>
            </DialogActions>
        </Dialog>
    );

    return !consent ? (
        <StyledSkoleGDPR>
            {renderWarning}
            {renderPrivacyPreferences}
        </StyledSkoleGDPR>
    ) : null;
};

const StyledSkoleGDPR = styled(Box)`
    position: fixed;
    bottom: 0;
    width: 100%;
    color: var(--white);
    padding: 0.5rem;
    background-color: var(--opacity-dark);
    text-align: left;

    @media only screen and (max-width: ${breakpoints.SM}) {
        bottom: 3rem;
    }

    .MuiButton-root {
        white-space: nowrap;
        margin: 0.25rem;

        @media only screen and (min-width: ${breakpoints.SM}) {
            width: auto;
        }
    }
`;
