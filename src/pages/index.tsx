import {
    Avatar,
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Grid,
    InputBase,
    makeStyles,
    Typography,
} from '@material-ui/core';
import { ArrowForwardOutlined, SearchOutlined, SvgIconComponent } from '@material-ui/icons';
import clsx from 'clsx';
import { LoadingLayout, MainLayout, OfflineLayout } from 'components';
import { useLanguageSelector, useSearch, useShare } from 'hooks';
import { includeDefaultNamespaces, Link, useTranslation, withAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { BORDER_RADIUS } from 'theme';
import { AuthProps } from 'types';
import { UrlObject } from 'url';
import { HOME_PAGE_SHORTCUTS } from 'utils';

const useStyles = makeStyles(({ palette, spacing, breakpoints }) => ({
    slogan: {
        position: 'relative',
        paddingTop: spacing(8),
        color: palette.common.white,
    },
    searchContainer: {
        textAlign: 'center',
        paddingBottom: spacing(16),
        position: 'relative',
        [breakpoints.up('md')]: {
            minHeight: '20rem',
        },
    },
    form: {
        position: 'relative',
    },
    searchFieldContainer: {
        marginTop: spacing(4),
        padding: `0 ${spacing(2)}`,
    },
    searchField: {
        display: 'flex',
        width: '100%',
        maxWidth: '20rem',
        backgroundColor: palette.common.white,
        border: `0.05rem solid ${palette.primary.main}`,
        borderRadius: `${BORDER_RADIUS} 0 0 ${BORDER_RADIUS}`,
        padding: spacing(3),
    },
    searchButton: {
        borderRadius: `0 ${BORDER_RADIUS} ${BORDER_RADIUS} 0`,
    },
    shortcutsContainer: {
        padding: `${spacing(8)} 0`,
    },
    inviteContainer: {
        flexGrow: 1,
        position: 'relative',
        padding: spacing(8),
    },
    card: {
        width: '100%',
        minHeight: '12rem',
        position: 'relative',
        [breakpoints.up('sm')]: {
            width: '12rem',
            height: '12rem',
        },
    },
    cardActionArea: {
        position: 'absolute',
        height: '100%',
        width: '100%',
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        height: '5rem',
        width: '5rem',
        margin: spacing(2),
        marginBottom: spacing(4),
        backgroundColor: palette.primary.light,
    },
    avatarIcon: {
        height: '3rem',
        width: '3rem',
    },
}));

interface Shortcut {
    text: string;
    icon: SvgIconComponent;
    href: string | UrlObject;
}

const IndexPage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { handleSubmit, inputProps } = useSearch();
    const { renderLanguageButton } = useLanguageSelector();

    const renderSearch = (
        <Grid container direction="column" justify="center" className={classes.searchContainer}>
            <Box className="main-background" />
            <Typography className={classes.slogan} variant="h1" gutterBottom>
                {t('common:slogan')}
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <Box className={classes.searchFieldContainer} display="flex" justifyContent="center">
                    <Box className={classes.searchField}>
                        <InputBase {...inputProps} />
                    </Box>
                    <Button className={classes.searchButton} type="submit" color="primary" variant="contained">
                        <SearchOutlined />
                    </Button>
                </Box>
            </form>
        </Grid>
    );

    const renderShortcuts = (
        <Grid container justify="center" className={classes.shortcutsContainer}>
            <Grid item xs={12} md={8} lg={6} xl={4} container spacing={2}>
                {HOME_PAGE_SHORTCUTS.map(({ href, text, icon: Icon }: Shortcut, i: number) => (
                    <Grid item xs={12} sm={4} container justify="center" key={i}>
                        <Link href={href}>
                            <Card className={clsx(classes.card)}>
                                <CardActionArea className={classes.cardActionArea}>
                                    <CardContent className={classes.cardContent}>
                                        <Avatar className={clsx(classes.avatar)}>
                                            <Icon className={classes.avatarIcon} />
                                        </Avatar>
                                        <Typography variant="h5" color="primary" align="center">
                                            {t(text)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );

    const { handleShare } = useShare({});

    const renderInvite = (
        <Grid container direction="column" alignItems="center" className={classes.inviteContainer}>
            <Typography variant="h6" color="primary" gutterBottom>
                {t('index:inviteHeader')}
            </Typography>
            <Typography component="br" />
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} container>
                <Button
                    onClick={handleShare}
                    color="primary"
                    variant="outlined"
                    endIcon={<ArrowForwardOutlined />}
                    fullWidth
                >
                    {t('index:inviteText')}
                </Button>
            </Grid>
        </Grid>
    );

    const seoProps = {
        title: t('index:title'),
        description: t('index:description'),
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            disableSearch: true,
            headerRight: renderLanguageButton,
        },
        containerProps: {
            fullWidth: true,
            dense: true,
        },
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if (authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    }

    return (
        <MainLayout {...layoutProps}>
            {renderSearch}
            {renderShortcuts}
            {renderInvite}
        </MainLayout>
    );
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['index']),
    },
});

export default withAuth(IndexPage);
