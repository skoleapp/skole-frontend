import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Typography,
} from '@material-ui/core';
import { CheckOutlined } from '@material-ui/icons';
import cookie from 'cookie';
import { useEffect, useState } from 'react';
import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../styles';
import { StyledDialog, TextLink } from '../shared';

export const SkoleGDPR: React.FC = () => {
    const [consent, setConsent] = useState(true);
    const [privacyPreferencesOpen, setPrivacyPreferencesOpen] = useState(false);

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
                This website stores cookies on your computer. These cookies are used to collect information about how
                you interact with our website and allow us to remember you. We use this information in order to improve
                and customize your browsing experience and for analytics and metrics about our visitors both on this
                website and other media. To find out more about the cookies we use, see our Privacy Policy.
            </Grid>
            <Grid item container xs={12} md={4} justify="space-evenly" alignItems="center">
                <Button onClick={openPrivacyPreferences} color="secondary" fullWidth>
                    privacy preferences
                </Button>
                <Button onClick={handleConsent} endIcon={<CheckOutlined />} variant="contained" fullWidth>
                    i agree
                </Button>
            </Grid>
        </Grid>
    );

    const renderPrivacyPreferences = (
        <StyledDialog open={privacyPreferencesOpen} onClose={closePrivacyPreferences}>
            <DialogTitle>Privacy Preferences</DialogTitle>
            <DialogContent>
                <Box textAlign="left">
                    <Typography variant="body1" gutterBottom>
                        Consent Management
                    </Typography>
                    <DialogContentText>
                        When you visit any website, it may store or retrieve information on your browser, mostly in the
                        form of cookies. This information might be about you, your preferences or your device and is
                        mostly used to make the site work as you expect it to. The information does not usually directly
                        identify you, but it can give you a more personalized web experience. Because we respect your
                        right to privacy, you can choose not to allow some types of cookies. However, blocking some
                        types of cookies may impact your experience of the site and the services we are able to offer.
                    </DialogContentText>
                </Box>
                <Box textAlign="left">
                    <Typography variant="body1" gutterBottom>
                        Privacy Policy
                    </Typography>
                    <DialogContentText>
                        You read and agreed to our <TextLink href="/privacy">Privacy Policy</TextLink>.
                    </DialogContentText>
                </Box>
                <Box textAlign="left">
                    <Typography variant="body1" gutterBottom>
                        Terms and Conditions
                    </Typography>
                    <DialogContentText>
                        You read and agreed to our <TextLink href="/terms">Terms and Conditions</TextLink>.
                    </DialogContentText>
                </Box>
                <Box textAlign="left">
                    <Typography variant="body1" gutterBottom>
                        Cookie Settings
                    </Typography>
                    <DialogContentText>
                        We use these cookies to ensure the correct language is being chosen for you based on your region
                        as well as the overall site functionality.
                    </DialogContentText>
                    <DialogContentText>Cookies: token, csrftoken, skole_gdpr_consent</DialogContentText>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={savePrivacyPreferences} variant="contained" color="primary" autoFocus>
                    save preferences
                </Button>
            </DialogActions>
        </StyledDialog>
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
    background-color: var(--dark-opacity);
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
