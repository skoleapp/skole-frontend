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
import { SearchOutlined, SvgIconComponent } from '@material-ui/icons';
import { LoadingLayout, MainLayout, OfflineLayout } from 'components';
import { useSearch } from 'hooks';
import { includeDefaultNamespaces, Link, useTranslation, withAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { AuthProps } from 'types';
import { UrlObject } from 'url';
import { SHORTCUTS as shortcuts } from 'utils';

const useStyles = makeStyles(({ palette, spacing, breakpoints }) => ({
    searchContainer: {
        textAlign: 'center',
        padding: `${spacing(8)} ${spacing(4)}`,
    },
    searchFieldContainer: {
        marginTop: spacing(4),
    },
    searchField: {
        display: 'flex',
        width: '100%',
        maxWidth: '20rem',
        backgroundColor: palette.common.white,
        border: `0.05rem solid ${palette.primary.main}`,
        borderRadius: '0.75rem 0 0 0.75rem',
    },
    searchInput: {
        padding: spacing(3),
    },
    searchButton: {
        borderRadius: '0 0.75rem 0.75rem 0',
    },
    shortcutsContainer: {
        flexGrow: 1,
        padding: spacing(2),
    },
    card: {
        marginTop: spacing(2),
        width: '100%',
        height: '14rem',
        position: 'relative',
        borderRadius: '0.75rem',
        [breakpoints.up('md')]: {
            width: '14rem',
            paddingBottom: 0,
            margin: spacing(2),
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

    const renderSearch = (
        <Box className={classes.searchContainer}>
            <Typography variant="h1" gutterBottom>
                {t('common:slogan')}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box className={classes.searchFieldContainer} display="flex" justifyContent="center">
                    <Box className={classes.searchField}>
                        <InputBase className={classes.searchInput} {...inputProps} />
                    </Box>
                    <Button className={classes.searchButton} type="submit" color="primary" variant="contained">
                        <SearchOutlined />
                    </Button>
                </Box>
            </form>
        </Box>
    );

    const renderShortcuts = (
        <Grid container justify="center">
            <Grid item xs={12} md={8} container justify="center" className={classes.shortcutsContainer}>
                {shortcuts.map(({ href, text, icon: Icon }: Shortcut, i: number) => (
                    <Grid item xs={12} md={4} container justify="center" key={i}>
                        <Link href={href}>
                            <Card className={classes.card}>
                                <CardActionArea className={classes.cardActionArea}>
                                    <CardContent className={classes.cardContent}>
                                        <Avatar className={classes.avatar}>
                                            <Icon className={classes.avatarIcon} />
                                        </Avatar>
                                        <Typography variant="h5" color="primary">
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

    const seoProps = {
        title: t('index:title'),
        description: t('index:description'),
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            disableSearch: true,
        },
        containerProps: {
            disableGutters: true,
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
        </MainLayout>
    );
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['index']),
    },
});

export default withAuth(IndexPage);
