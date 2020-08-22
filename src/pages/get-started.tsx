import { Avatar, Box, Grid, makeStyles, Typography } from '@material-ui/core';
import { ButtonLink, LoadingLayout, MainLayout, TextLink } from 'components';
import { useLanguageSelector } from 'hooks';
import { includeDefaultNamespaces, useTranslation, withNoAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { AuthProps } from 'types';
import { GET_STARTED_ITEMS, urls } from 'utils';

const useStyles = makeStyles(({ spacing, palette }) => ({
    root: {
        textAlign: 'center',
        padding: `${spacing(8)} ${spacing(4)}`,
    },
    itemContainer: {
        marginTop: spacing(4),
    },
    getStartedItem: {
        marginTop: spacing(4),
    },
    avatar: {
        backgroundColor: palette.primary.main,
        color: palette.secondary.main,
        height: '7rem',
        width: '7rem',
        marginBottom: spacing(2),
    },
    icon: {
        height: '5rem',
        width: '5rem',
    },
    subHeader: {
        marginTop: spacing(8),
    },
    ctaContainer: {
        marginTop: spacing(4),
    },
    ctaButton: {
        borderRadius: '1.5rem',
        minWidth: '10rem',
    },
    loginLink: {
        marginTop: spacing(4),
    },
}));

// This page will be available also when offline.
const GetStartedPage: NextPage<AuthProps> = ({ authLoading }) => {
    const classes = useStyles();
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
        disableBottomNavbar: true,
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    return (
        <MainLayout {...layoutProps}>
            <Box className={classes.root}>
                <Typography variant="h1" gutterBottom>
                    {t('common:slogan')}
                </Typography>
                <Typography variant="subtitle1">{t('get-started:header')}</Typography>
                <Grid className={classes.itemContainer} container justify="center">
                    {GET_STARTED_ITEMS.map(({ text, icon: Icon }, i) => (
                        <Grid
                            className={classes.getStartedItem}
                            key={i}
                            item
                            xs={12}
                            sm={4}
                            container
                            direction="column"
                            alignItems="center"
                        >
                            <Avatar className={classes.avatar}>
                                <Icon className={classes.icon} />
                            </Avatar>
                            <Typography variant="h5">{t(text)}</Typography>
                        </Grid>
                    ))}
                </Grid>
                <Typography className={classes.subHeader} variant="subtitle1">
                    {t('get-started:subheader')}
                </Typography>
                <Grid className={classes.ctaContainer} container direction="column" alignItems="center">
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
            </Box>
        </MainLayout>
    );
};

// const StyledGetStartedPage = styled(Box)`
//     min-height: 100vh;
//     width: 100%;
//     display: flex;
//     text-align: center;

//     #top-section-background {
//         position: absolute;
//         background-color: var(--primary-light);
//         top: 3rem;
//         left: 0;
//         right: 0;
//         height: 45.5rem;
//         z-index: 0;

//         @media only screen and (min-width: ${breakpoints.SM}) {
//             height: 24rem;
//         }
//     }

//     #top-section {
//         color: var(--white);
//         z-index: 1;

//         .get-started-icon {
//             background-color: var(--secondary);
//             color: var(--primary);
//             margin-left: auto;
//             margin-right: auto;
//             height: 7rem;
//             width: 7rem;

//             .MuiSvgIcon-root {

//             }
//         }
//     }

//     #bottom-section {
//         background-color: var(--secondary);
//         flex-grow: 1;

//         #get-started-cta {
//             border-radius: 1.5rem;
//             padding: 0.75rem;
//             min-width: 10rem;
//         }
//     }
// `;

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['get-started']),
    },
});

export default withNoAuth(GetStartedPage);
