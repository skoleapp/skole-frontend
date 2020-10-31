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
import { MainLayout } from 'components';
import { useLanguageSelector, useSearch, useShare } from 'hooks';
import { Link, useTranslation, withUserMe } from 'lib';
import { NextPage } from 'next';
import React from 'react';
import { BORDER_RADIUS } from 'theme';
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
        borderRadius: BORDER_RADIUS,
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

const IndexPage: NextPage = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { handleSubmit, inputProps } = useSearch();
    const { renderLanguageButton } = useLanguageSelector();
    const { handleShare } = useShare({});

    const renderMainBackground = <Box className="main-background" />;

    const renderSlogan = (
        <Typography className={classes.slogan} variant="h1" gutterBottom>
            {t('common:slogan')}
        </Typography>
    );

    const renderSearchField = (
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
    );

    const renderSearch = (
        <Grid container direction="column" justify="center" className={classes.searchContainer}>
            {renderMainBackground}
            {renderSlogan}
            {renderSearchField}
        </Grid>
    );

    const renderHomepageShortcuts = HOME_PAGE_SHORTCUTS.map(({ href, text, icon: Icon }: Shortcut, i: number) => (
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
    ));

    const renderShortcuts = (
        <Grid container justify="center" className={classes.shortcutsContainer}>
            <Grid item xs={12} md={8} lg={6} xl={4} container spacing={2}>
                {renderHomepageShortcuts}
            </Grid>
        </Grid>
    );

    const renderInvite = (
        <Grid container direction="column" alignItems="center" className={classes.inviteContainer}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
                {t('index:inviteHeader')}
            </Typography>
            <Typography component="br" />
            <Button onClick={handleShare} color="primary" variant="contained" endIcon={<ArrowForwardOutlined />}>
                {t('index:inviteText')}
            </Button>
        </Grid>
    );

    const layoutProps = {
        seoProps: {
            title: t('index:title'),
            description: t('index:description'),
        },
        topNavbarProps: {
            disableSearch: true,
            headerRight: renderLanguageButton,
        },
        containerProps: {
            fullWidth: true,
            dense: true,
        },
    };

    return (
        <MainLayout {...layoutProps}>
            {renderSearch}
            {renderShortcuts}
            {renderInvite}
        </MainLayout>
    );
};

export default withUserMe(IndexPage);
