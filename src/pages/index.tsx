import { Avatar, Box, Button, Card, CardActionArea, CardContent, InputBase, Typography } from '@material-ui/core';
import { SearchOutlined, SvgIconComponent } from '@material-ui/icons';
import { MainLayout } from 'components';
import { useSearch } from 'hooks';
import { includeDefaultNamespaces, Link, useTranslation, withAuth, withUserAgent, withUserMe } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import styled from 'styled-components';
import { breakpoints } from 'styles';
import { I18nProps } from 'types';
import { UrlObject } from 'url';
import { SHORTCUTS } from 'utils';

interface Shortcut {
    text: string;
    icon: SvgIconComponent;
    href: string | UrlObject;
}

const IndexPage: NextPage<I18nProps> = () => {
    const { t } = useTranslation();
    const { handleSubmit, inputProps } = useSearch();

    const renderSearch = (
        <Box id="top-section-container">
            <Box id="top-section-background" />
            <Box id="top-section-content">
                <Box id="slogan">
                    <Typography variant="h1">{t('common:slogan')}</Typography>
                </Box>
                <Box id="search-widget" marginTop="1rem">
                    <form onSubmit={handleSubmit}>
                        <Box display="flex" justifyContent="center">
                            <Box id="search-widget-input">
                                <InputBase {...inputProps} />
                            </Box>
                            <Button type="submit" color="primary" variant="contained">
                                <SearchOutlined />
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Box>
    );

    const renderShortcuts = (
        <Box id="shortcuts">
            {SHORTCUTS.map(({ href, text, icon: Icon }: Shortcut, i: number) => (
                <Link href={href} key={i}>
                    <Card>
                        <CardActionArea>
                            <CardContent>
                                <Avatar>
                                    <Icon />
                                </Avatar>
                                <Box marginTop="0.5rem">
                                    <Typography variant="h2" color="primary">
                                        {t(text)}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Link>
            ))}
        </Box>
    );

    const renderChildren = (
        <>
            {renderSearch}
            {renderShortcuts}
        </>
    );

    const layoutProps = {
        seoProps: {
            title: t('index:title'),
            description: t('index:description'),
        },
        topNavbarProps: {
            disableSearch: true,
        },
    };

    return (
        <StyledIndexPage>
            <MainLayout {...layoutProps}>{renderChildren}</MainLayout>
        </StyledIndexPage>
    );
};

const StyledIndexPage = styled(Box)`
    .MuiContainer-root {
        @media only screen and (max-width: ${breakpoints.MD}) {
            padding: 0.5rem !important;
        }
    }

    #top-section-container {
        height: 10rem;

        @media only screen and (min-width: ${breakpoints.MD}) {
            height: 18rem;
        }

        #top-section-background {
            z-index: 0;
            background-color: var(--primary-light);
            position: absolute;
            top: 3rem;
            left: 0;
            right: 0;
            height: 10rem;

            @media only screen and (min-width: ${breakpoints.MD}) {
                height: 18rem;
            }
        }

        #top-section-content {
            color: var(--white);
            z-index: 2;
            padding-bottom: 1rem;
            position: relative;

            #slogan {
                margin-top: 1rem;

                @media only screen and (min-width: ${breakpoints.MD}) {
                    margin-top: 4rem;
                }
            }

            #search-widget {
                #search-widget-input {
                    border-radius: var(--border-radius) 0 0 var(--border-radius);
                    background-color: var(--white);
                    display: flex;
                    width: 100%;
                    max-width: 20rem;

                    input {
                        padding: 0.75rem;
                    }
                }

                .MuiButton-root {
                    border-radius: 0 var(--border-radius) var(--border-radius) 0;
                }
            }
        }
    }

    #shortcuts {
        flex-flow: row wrap;
        display: flex;
        justify-content: center;

        @media only screen and (min-width: ${breakpoints.SM}) {
            margin-top: 1rem;
        }

        .MuiCard-root {
            margin-top: 0.5rem;
            width: 100%;
            padding-bottom: 55%;
            position: relative;

            @media only screen and (min-width: ${breakpoints.SM}) {
                width: 14rem;
                height: 14rem;
                padding-bottom: 0;
                margin: 0.5rem !important;
            }

            .MuiCardActionArea-root {
                position: absolute;
                height: 100%;
                width: 100%;

                .MuiCardContent-root {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    .MuiAvatar-root {
                        height: 5rem;
                        width: 5rem;
                        margin: 0.5rem;
                        background-color: var(--primary-light);

                        .MuiSvgIcon-root {
                            height: 3rem;
                            width: 3rem;
                        }
                    }
                }
            }
        }
    }
`;

const wrappers = R.compose(withUserAgent, withUserMe);

export const getServerSideProps: GetServerSideProps = wrappers(async () => ({
    props: { namespacesRequired: includeDefaultNamespaces(['index']) },
}));

export default withAuth(IndexPage);
