import {
    Avatar,
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Grid,
    GridJustification,
    InputBase,
    makeStyles,
    Typography,
} from '@material-ui/core';
import { ArrowForwardOutlined, SearchOutlined, SvgIconComponent } from '@material-ui/icons';
import clsx from 'clsx';
import { MainBackground, MainLayout } from 'components';
import { useLanguageSelector, useSearch, useShare } from 'hooks';
import { loadNamespaces, useTranslation, withUserMe } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { BORDER_RADIUS } from 'theme';
import { UrlObject } from 'url';
import { HOME_PAGE_SHORTCUTS } from 'utils';

const useStyles = makeStyles(({ palette, spacing, breakpoints }) => ({
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    searchContainer: {
        position: 'relative',
        padding: spacing(6),
        marginTop: spacing(4),
        [breakpoints.up('sm')]: {
            marginTop: spacing(10),
        },
        [breakpoints.up('md')]: {
            marginTop: spacing(16),
            padding: spacing(10),
        },
    },
    header: {
        fontSize: '1.5rem',
    },
    subheader: {
        fontSize: '1.25rem',
    },
    searchForm: {
        marginTop: spacing(4),
        display: 'flex',
    },
    searchField: {
        display: 'flex',
        flexGrow: 1,
        backgroundColor: palette.common.white,
        border: `0.05rem solid ${palette.primary.main}`,
        borderRadius: `${BORDER_RADIUS} 0 0 ${BORDER_RADIUS}`,
        padding: spacing(3),
    },
    searchButton: {
        borderRadius: `0 ${BORDER_RADIUS} ${BORDER_RADIUS} 0`,
    },
    shortcutsContainer: {
        position: 'relative',
        backgroundColor: '#dbdbdb',
        padding: `${spacing(4)} ${spacing(2)}`,
        [breakpoints.up('md')]: {
            padding: spacing(10),
        },
    },
    card: {
        width: '100%',
        minHeight: '14rem',
        position: 'relative',
        margin: spacing(2),
        [breakpoints.up('md')]: {
            width: '14rem',
            height: '14rem',
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
    inviteContainer: {
        position: 'relative',
        backgroundColor: palette.common.white,
        flexGrow: 1,
    },
    inviteContent: {
        padding: spacing(4),
        textAlign: 'center',
        [breakpoints.up('md')]: {
            padding: spacing(12),
        },
    },
    inviteButton: {
        marginTop: spacing(4),
    },
}));

interface Shortcut {
    text: string;
    icon: SvgIconComponent;
    href: string | UrlObject;
    justify: GridJustification;
}

const IndexPage: NextPage = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { handleSubmit, inputProps } = useSearch();
    const { renderLanguageButton } = useLanguageSelector();
    const { handleShare } = useShare({});

    const colSpan: {} = {
        xs: 12,
        md: 10,
        lg: 7,
        xl: 5,
    };

    const renderBackground = <MainBackground />;

    const renderSearch = (
        <Grid className={classes.searchContainer} item container direction="column" {...colSpan}>
            <Typography className={classes.header} variant="h1" color="secondary">
                {t('index:header')}
            </Typography>
            <Typography className={classes.subheader} variant="subtitle1" color="secondary">
                {t('index:subheader')}
            </Typography>
            <form className={classes.searchForm} onSubmit={handleSubmit}>
                <Box className={classes.searchField}>
                    <InputBase {...inputProps} />
                </Box>
                <Button className={classes.searchButton} type="submit" color="primary" variant="contained">
                    <SearchOutlined />
                </Button>
            </form>
        </Grid>
    );

    const renderHomepageShortcuts = HOME_PAGE_SHORTCUTS.map(
        ({ href, text, justify, icon: Icon }: Shortcut, i: number) => (
            <Grid item xs={12} md={4} container justify={justify} key={i}>
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
        ),
    );

    const renderShortcuts = (
        <Grid container justify="center" className={classes.shortcutsContainer}>
            <Grid item container spacing={4} justify="space-between" {...colSpan}>
                {renderHomepageShortcuts}
            </Grid>
        </Grid>
    );

    const renderInfo = (
        <Grid className={classes.inviteContainer} container justify="center">
            <Grid
                className={classes.inviteContent}
                item
                container
                direction="column"
                alignItems="center"
                justify="center"
                {...colSpan}
            >
                <Typography className={classes.subheader} variant="subtitle1" color="textSecondary" gutterBottom>
                    {t('index:inviteHeader')}
                </Typography>
                <Button
                    className={classes.inviteButton}
                    onClick={handleShare}
                    color="primary"
                    variant="outlined"
                    endIcon={<ArrowForwardOutlined />}
                >
                    {t('index:inviteFriends')}
                </Button>
            </Grid>
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
            <Grid container direction="column" alignItems="center" className={classes.container}>
                {renderBackground}
                {renderSearch}
                {renderShortcuts}
                {renderInfo}
            </Grid>
        </MainLayout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        _ns: await loadNamespaces(['index'], locale),
    },
});

export default withUserMe(IndexPage);
