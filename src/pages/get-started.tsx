import { Avatar, Box, Grid, Typography } from '@material-ui/core';
import { AssignmentOutlined, ChatOutlined, SchoolOutlined } from '@material-ui/icons';
import { ButtonLink, MainLayout, TextLink } from 'components';
import { includeDefaultNamespaces } from 'i18n';
import { withNoAuth, withUserAgent } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { breakpoints } from 'styles';
import { I18nProps } from 'types';
import { urls } from 'utils';

const GetStartedPage: NextPage<I18nProps> = () => {
    const { t } = useTranslation();
    const { query } = useRouter();
    const renderTopSectionBackground = <Box id="top-section-background" />;

    const renderTopSectionContent = (
        <Box id="top-section" padding="0.5rem">
            <Box marginTop="0.5rem">
                <Typography variant="h1">{t('common:slogan')}</Typography>
            </Box>
            <Box marginTop="2rem">
                <Typography variant="subtitle1">{t('get-started:header')}</Typography>
            </Box>
            <Box marginY="2rem">
                <Grid container justify="center">
                    <Grid item xs={12} sm={3}>
                        <Box margin="1rem">
                            <Avatar className="get-started-icon">
                                <AssignmentOutlined />
                            </Avatar>
                            <Box marginTop="0.5rem">
                                <Typography variant="h2">{t('common:resources')}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box margin="1rem">
                            <Avatar className="get-started-icon">
                                <SchoolOutlined />
                            </Avatar>
                            <Box marginTop="0.5rem">
                                <Typography variant="h2">{t('common:courses')}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box margin="1rem">
                            <Avatar className="get-started-icon">
                                <ChatOutlined />
                            </Avatar>
                            <Box marginTop="0.5rem">
                                <Typography variant="h2">{t('common:discussion')}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );

    const renderBottomSection = (
        <Box id="bottom-section" padding="0.5rem">
            <Box marginTop="1rem">
                <Typography variant="subtitle1">{t('get-started:subheader')}</Typography>
            </Box>
            <Box marginTop="1rem">
                <ButtonLink
                    id="get-started-cta"
                    href={{ pathname: urls.register, query }}
                    color="primary"
                    variant="contained"
                >
                    {t('get-started:cta')}
                </ButtonLink>
                <Box marginY="1rem">
                    <TextLink color="primary" href={{ pathname: urls.login, query }}>
                        {t('common:alreadyHaveAccount')}
                    </TextLink>
                </Box>
            </Box>
        </Box>
    );

    const layoutProps = {
        seoProps: {
            title: t('get-started:title'),
            description: t('get-started:description'),
        },
        topNavbarProps: {
            disableAuthButtons: true,
        },
        disableBottomNavbar: true,
    };

    return (
        <MainLayout {...layoutProps}>
            <StyledGetStartedPage>
                <Box flexGrow="1" display="flex" flexDirection="column">
                    {renderTopSectionBackground}
                    {renderTopSectionContent}
                    {renderBottomSection}
                </Box>
            </StyledGetStartedPage>
        </MainLayout>
    );
};

const StyledGetStartedPage = styled(Box)`
    min-height: 100vh;
    width: 100%;
    display: flex;
    text-align: center;

    #top-section-background {
        position: absolute;
        background-color: var(--primary-light);
        top: 3rem;
        left: 0;
        right: 0;
        height: 45.5rem;
        z-index: 0;

        @media only screen and (min-width: ${breakpoints.SM}) {
            height: 24rem;
        }
    }

    #top-section {
        color: var(--white);
        z-index: 1;

        .get-started-icon {
            background-color: var(--secondary);
            color: var(--primary);
            margin-left: auto;
            margin-right: auto;
            height: 7rem;
            width: 7rem;

            .MuiSvgIcon-root {
                height: 5rem;
                width: 5rem;
            }
        }
    }

    #bottom-section {
        background-color: var(--secondary);
        flex-grow: 1;

        #get-started-cta {
            border-radius: 1.5rem;
            padding: 0.75rem;
            min-width: 10rem;
        }
    }
`;

const wrappers = R.compose(withUserAgent, withNoAuth);

export const getServerSideProps: GetServerSideProps = wrappers(async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['get-started']),
    },
}));

export default GetStartedPage;
