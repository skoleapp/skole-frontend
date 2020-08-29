import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Grid,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import { ButtonLink, LoadingLayout, MainLayout, TextLink } from 'components';
import { useLanguageSelector } from 'hooks';
import { includeDefaultNamespaces, useTranslation, withNoAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'styles';
import { AuthProps } from 'types';
import { GET_STARTED_ITEMS, urls } from 'utils';

const useStyles = makeStyles(({ spacing, palette }) => ({
    topSectionContainer: {
        backgroundColor: palette.grey[300],
        padding: spacing(8),
        minHeight: '20rem',
    },
    bottomSectionContainer: {
        padding: spacing(8),
        backgroundColor: palette.common.white,
        minHeight: '20rem',
        flexGrow: 1,
    },
    image: {
        maxWidth: '100%',
        maxHeight: '25rem',
        borderRadius: BORDER_RADIUS,
    },
    card: {
        boxShadow: 'none',
        border: BORDER,
        height: '100%',
    },
    getStartedItem: {
        marginTop: spacing(4),
    },
    avatar: {
        backgroundColor: palette.primary.light,
        color: palette.secondary.main,
        height: '3rem',
        width: '3rem',
    },
    icon: {
        height: '2rem',
        width: '2rem',
    },
    media: {
        width: '100%',
    },
    ctaContainer: {
        marginTop: '5rem',
        textAlign: 'center',
    },
    ctaButton: {
        minWidth: '10rem',
        padding: spacing(3),
        marginTop: spacing(8),
    },
    loginLink: {
        marginTop: spacing(4),
    },
}));

// This page will be available also when offline.
const GetStartedPage: NextPage<AuthProps> = ({ authLoading }) => {
    const classes = useStyles();
    const { breakpoints } = useTheme();
    const isMobileOrTablet = useMediaQuery(breakpoints.down('md'));
    const { t } = useTranslation();
    const { query } = useRouter();
    const { renderLanguageButton } = useLanguageSelector();

    const seoProps = {
        title: t('get-started:title'),
        description: t('get-started:description'),
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            disableAuthButtons: true,
            headerRight: renderLanguageButton,
        },
        containerProps: {
            style: {
                margin: 0,
                padding: 0,
                maxWidth: '100%',
            },
        },
        disableBottomNavbar: true,
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    return (
        <MainLayout {...layoutProps}>
            <Grid container justify="center" className={classes.topSectionContainer}>
                <Grid item lg={6} container alignItems="center" spacing={5}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h1" gutterBottom>
                            {t('common:slogan')}
                        </Typography>
                        <Typography variant="h5" color="textSecondary" gutterBottom>
                            {t('get-started:header')}
                        </Typography>
                        <Typography variant="h6">{t('get-started:header2')}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6} container justify={isMobileOrTablet ? 'flex-start' : 'flex-end'}>
                        <img
                            className={classes.image}
                            src="images/landing-page/header-img.jpg"
                            alt="School supplies."
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid className={classes.bottomSectionContainer} container justify="center" alignItems="center">
                <Grid item lg={6} container spacing={5}>
                    {GET_STARTED_ITEMS.map(({ title, image, description, icon: Icon }, i) => (
                        <Grid className={classes.getStartedItem} key={i} item xs={12} sm={4}>
                            <Card className={classes.card}>
                                <CardHeader
                                    avatar={
                                        <Avatar className={classes.avatar}>
                                            <Icon className={classes.icon} />
                                        </Avatar>
                                    }
                                    title={
                                        <Typography variant="h5" color="primary" gutterBottom>
                                            {t(title)}
                                        </Typography>
                                    }
                                />
                                <CardMedia component="img" image={image} alt={title} height="160" />
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary">
                                        {t(description)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Grid
                    className={classes.ctaContainer}
                    container
                    direction="column"
                    alignItems="center"
                    justify="center"
                >
                    <Typography variant="h5" color="textSecondary">
                        {t('get-started:subheader')}
                    </Typography>
                    <ButtonLink
                        className={classes.ctaButton}
                        href={{ pathname: urls.register, query }}
                        color="primary"
                        variant="contained"
                    >
                        {t('get-started:cta')}
                    </ButtonLink>
                    <TextLink className={classes.loginLink} color="primary" href={{ pathname: urls.login, query }}>
                        {t('common:login')}
                    </TextLink>
                </Grid>
            </Grid>
        </MainLayout>
    );
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['get-started']),
    },
});

export default withNoAuth(GetStartedPage);
