import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, MainBackground, MainLayout, TextLink } from 'components';
import { useLanguageSelector } from 'hooks';
import { loadNamespaces, useTranslation, withNoAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { COLORS } from 'theme';
import { GET_STARTED_PAGE_VISITED_KEY, urls } from 'utils';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
    container: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
    },
    headerContainer: {
        position: 'relative',
        textAlign: 'center',
        marginTop: spacing(8),
        padding: spacing(2),
        [breakpoints.up('lg')]: {
            marginTop: spacing(16),
        },
    },
    logo: {
        height: '4rem',
        position: 'relative',
        [breakpoints.up('sm')]: {
            height: '5rem',
        },
        [breakpoints.up('md')]: {
            height: '6rem',
        },
    },
    slogan: {
        fontSize: '1.5rem',
        marginTop: spacing(4),
    },
    ctaContainer: {
        position: 'relative',
        textAlign: 'center',
        padding: `${spacing(4)} ${spacing(2)}`,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ctaHeader: {
        fontSize: '1.25rem',
        [breakpoints.up('sm')]: {
            fontSize: '1.5rem',
        },
        [breakpoints.up('md')]: {
            fontSize: '1.75rem',
        },
    },
    ctaButton: {
        minWidth: '10rem',
        padding: spacing(3),
        marginTop: spacing(8),
    },
    badgeContainer: {
        position: 'relative',
        textAlign: 'center',
        padding: `${spacing(4)} ${spacing(2)}`,
        backgroundColor: COLORS.backgroundGrey,
    },
    badge: {
        width: '8rem',
        height: '4rem',
        margin: spacing(2),
        position: 'relative',
        [breakpoints.up('sm')]: {
            width: '10rem',
            height: '4rem',
        },
        [breakpoints.up('md')]: {
            width: '12rem',
            height: '5rem',
        },
        [breakpoints.up('lg')]: {
            width: '15rem',
            height: '7rem',
        },
    },
    or: {
        marginTop: spacing(4),
    },
    authLink: {
        marginTop: spacing(4),
    },
}));

const GetStartedPage: NextPage = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { query } = useRouter();
    const { renderLanguageButton } = useLanguageSelector();

    const ctaUrl = {
        pathname: urls.register,
        query,
    };

    const skipLoginUrl = {
        pathname: !!query.next ? String(query.next) : urls.home,
        query,
    };

    useEffect(() => {
        localStorage.setItem(GET_STARTED_PAGE_VISITED_KEY, new Date().toString());
    }, []);

    const layoutProps = {
        seoProps: {
            title: t('get-started:title'),
            description: t('get-started:description'),
        },
        disableBottomNavbar: true,
        topNavbarProps: {
            headerRight: renderLanguageButton,
            disableLogo: true,
        },
        containerProps: {
            fullWidth: true,
            dense: true,
        },
    };

    const renderBackground = <MainBackground />;

    const renderHeaders = (
        <Box className={classes.headerContainer}>
            <Box className={classes.logo}>
                <Image layout="fill" src="/images/icons/skole-icon-text.svg" />
            </Box>
            <Typography className={classes.slogan} variant="h1" color="secondary" gutterBottom>
                {t('get-started:slogan')}
            </Typography>
        </Box>
    );

    const renderCta = (
        <Box className={classes.ctaContainer}>
            <Typography className={classes.ctaHeader} variant="subtitle1" color="secondary">
                {t('get-started:header')}
            </Typography>
            <ButtonLink
                className={classes.ctaButton}
                href={ctaUrl}
                color="primary"
                variant="contained"
                endIcon={<ArrowForwardOutlined />}
            >
                {t('get-started:cta')}
            </ButtonLink>
            <Typography className={classes.or} variant="body2" color="secondary">
                {t('get-started:or').toUpperCase()}
            </Typography>
            <Typography className={classes.authLink}>
                <TextLink color="secondary" href={skipLoginUrl}>
                    {t('get-started:skipLogin')}
                </TextLink>
            </Typography>
        </Box>
    );

    const renderAppStoreBadges = (
        <Box className={classes.badgeContainer}>
            <Typography variant="subtitle1" color="textSecondary">
                {t('get-started:appStoreCta')}
            </Typography>
            <Grid container justify="center">
                <Box className={classes.badge}>
                    <Image layout="fill" src="/images/app-store-badges/apple-app-store-badge.svg" />
                </Box>
                <Box className={classes.badge}>
                    <Image layout="fill" src="/images/app-store-badges/google-play-badge.svg" />
                </Box>
            </Grid>
        </Box>
    );

    return (
        <MainLayout {...layoutProps}>
            <Box className={classes.container}>
                {renderBackground}
                {renderHeaders}
                {renderCta}
                {renderAppStoreBadges}
            </Box>
        </MainLayout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        _ns: await loadNamespaces(['get-started'], locale),
    },
});

export default withNoAuth(GetStartedPage);
