import { Avatar, Box, Card, CardContent, CardHeader, CardMedia, Grid, makeStyles, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, MainLayout, TextLink } from 'components';
import { useLanguageSelector } from 'hooks';
import { loadNamespaces, useTranslation, withNoAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GET_STARTED_ITEMS, GET_STARTED_PAGE_VISITED_KEY, urls } from 'utils';

const useStyles = makeStyles(({ spacing, palette }) => ({
    topSectionContainer: {
        minHeight: '25rem',
        position: 'relative',
    },
    topSectionContent: {
        padding: spacing(8),
        color: palette.common.white,
        position: 'relative',
    },
    bottomSectionContainer: {
        flexGrow: 1,
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    getStartedItem: {
        marginTop: spacing(4),
    },
    cardHeader: {
        display: 'flex',
        padding: spacing(3),
    },
    cardHeaderContent: {
        display: 'flex',
        alignItems: 'center',
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
    badgeContainer: {
        marginTop: spacing(16),
    },
    badge: {
        width: '15rem',
        height: '6rem',
        margin: spacing(2),
        opacity: 0.5, // Remove opacity when links are enabled.
    },
    ctaContainer: {
        padding: spacing(8),
        textAlign: 'center',
    },
    ctaButton: {
        minWidth: '10rem',
        padding: spacing(3),
        marginTop: spacing(8),
    },
    authLink: {
        marginTop: spacing(8),
    },
    cardTextContainer: {
        flexGrow: 1,
    },
    chip: {
        marginTop: spacing(2),
    },
    chipIcon: {
        marginLeft: spacing(2),
        height: '1rem',
    },
}));

const GetStartedPage: NextPage = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { query } = useRouter();
    const { renderLanguageButton } = useLanguageSelector();

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
        },
        containerProps: {
            fullWidth: true,
            dense: true,
        },
    };

    return (
        <MainLayout {...layoutProps}>
            <Grid container justify="center" alignItems="center" className={classes.topSectionContainer}>
                <Box className="main-background" />
                <Grid item xs={12} lg={10} xl={8} className={classes.topSectionContent}>
                    <Typography variant="h1" gutterBottom>
                        {t('common:slogan')}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        {t('get-started:header')}
                    </Typography>
                    <Typography variant="h6">{t('get-started:header2')}</Typography>
                </Grid>
            </Grid>
            <Grid className={classes.bottomSectionContainer} container justify="center" alignItems="center">
                <Grid item xs={12} lg={10} xl={8} container spacing={4}>
                    {GET_STARTED_ITEMS.map(({ title, image, description, icon: Icon }, i) => (
                        <Grid className={classes.getStartedItem} key={i} item xs={12} sm={4}>
                            <Card className={classes.card}>
                                <CardHeader
                                    classes={{ root: classes.cardHeader, content: classes.cardHeaderContent }}
                                    avatar={
                                        <Avatar className={classes.avatar}>
                                            <Icon className={classes.icon} />
                                        </Avatar>
                                    }
                                    title={
                                        <Typography variant="h5" color="primary">
                                            {t(title)}
                                        </Typography>
                                    }
                                />
                                <CardMedia component="img" image={image} alt={title} height="180" />
                                <CardContent className={classes.cardTextContainer}>
                                    <Typography variant="body2" color="textSecondary">
                                        {t(description)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <Grid className={classes.badgeContainer} container direction="column" alignItems="center">
                <Typography variant="subtitle1" color="primary">
                    {t('get-started:appStoreCta')}
                </Typography>
                <Grid container justify="center">
                    <img className={classes.badge} src="/images/app-store-badges/apple-app-store-badge.svg" />
                    <img className={classes.badge} src="/images/app-store-badges/google-play-badge.svg" />
                </Grid>
            </Grid>
            <Grid className={classes.ctaContainer} container direction="column" alignItems="center">
                <Typography variant="h5" color="primary">
                    {t('get-started:subheader')}
                </Typography>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} container direction="column" alignItems="center">
                    <ButtonLink
                        className={classes.ctaButton}
                        href={{ pathname: urls.register, query }}
                        color="primary"
                        variant="contained"
                        endIcon={<ArrowForwardOutlined />}
                    >
                        {t('get-started:cta')}
                    </ButtonLink>
                    <TextLink
                        className={classes.authLink}
                        color="primary"
                        href={{ pathname: (query.next as string) || urls.home, query }}
                    >
                        {t('get-started:skipLogin')}
                    </TextLink>
                </Grid>
            </Grid>
        </MainLayout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        _ns: await loadNamespaces(['get-started'], locale),
    },
});

export default withNoAuth(GetStartedPage);
