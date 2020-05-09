import { Avatar, Box, Button, Card, CardContent, InputBase, Typography } from '@material-ui/core';
import {
    CloudUploadOutlined,
    ContactSupportOutlined,
    LibraryAddOutlined,
    SchoolOutlined,
    SearchOutlined,
    SvgIconComponent,
} from '@material-ui/icons';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UrlObject } from 'url';

import { ButtonLink, MainLayout } from '../components';
import { includeDefaultNamespaces, Link } from '../i18n';
import { withAuthSync } from '../lib';
import { breakpoints } from '../styles';
import { I18nProps } from '../types';
import { useSearch } from '../utils';

interface Shortcut {
    text: string;
    icon: SvgIconComponent;
    href: string | UrlObject;
}

const IndexPage: NextPage<I18nProps> = () => {
    const { t } = useTranslation();
    const { handleSubmit, searchUrl, inputProps } = useSearch();

    const shortcuts = [
        {
            text: 'index:browseCourses',
            icon: SchoolOutlined,
            href: searchUrl,
        },
        {
            text: 'index:uploadResource',
            icon: CloudUploadOutlined,
            href: '/upload-resource',
        },
        {
            text: 'index:createCourse',
            icon: LibraryAddOutlined,
            href: '/create-course',
        },
    ];

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
            <MainLayout {...layoutProps}>
                <Box id="top-section-container">
                    <Box id="top-section-background" />
                    <Box id="top-section-content">
                        <Box id="slogan">
                            <Typography variant="h1">{t('common:slogan')}</Typography>
                        </Box>
                        <Box marginTop="1rem">
                            <Typography variant="body2">{t('index:marketingText')}</Typography>
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
                <Box marginTop="1rem">
                    <Typography variant="h3" color="primary">
                        {t('index:marketingText2')}
                    </Typography>
                </Box>
                <Box id="shortcuts" display="flex" justifyContent="center" marginTop="1rem">
                    {shortcuts.map(({ href, text, icon: Icon }: Shortcut, i: number) => (
                        <Link href={href} key={i}>
                            <Card>
                                <CardContent>
                                    <Avatar>
                                        <Icon />
                                    </Avatar>
                                    <Typography variant="h2" color="primary">
                                        {t(text)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </Box>
                <Box marginTop="2rem">
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                        {t('index:contactUsText')}
                    </Typography>
                </Box>
                <Box marginTop="0.5rem">
                    <ButtonLink href="/contact" variant="outlined" color="primary" endIcon={<ContactSupportOutlined />}>
                        {t('index:contactUsButton')}
                    </ButtonLink>
                </Box>
            </MainLayout>
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
        position: relative;
        min-height: 15rem;

        @media only screen and (min-width: ${breakpoints.MD}) {
            min-height: 18rem;
        }

        #top-section-background {
            z-index: 0;
            background: url('/images/home-background.jpg') no-repeat center center/cover;
            position: absolute;
            top: -0.5rem;
            right: -0.5rem;
            left: -0.5rem;
            bottom: 0;

            @media only screen and (min-width: ${breakpoints.MD}) {
                top: -1rem;
                left: -1rem;
                right: -1rem;
            }

            @media only screen and (min-width: ${breakpoints.LG}) {
                // FIXME: Not working properly, add proper logic for optimal width.
                right: calc(-100vw + ${breakpoints.LG} / 2 - 1rem);
                left: calc(-100vw + ${breakpoints.LG} / 2 - 1rem);
            }
        }

        #top-section-background:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            background-color: var(--primary);
            opacity: 0.6;
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
                    border: 0.05rem solid var(--primary);

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

        .MuiCard-root {
            cursor: pointer;
            margin-top: 0.5rem;
            width: 100%;
            padding-bottom: 50%;
            position: relative;

            @media only screen and (min-width: ${breakpoints.SM}) {
                width: 14rem;
                height: 14rem;
                padding-bottom: 0;
                margin: 0.5rem !important;
            }

            .MuiCardContent-root {
                position: absolute;
                height: 100%;
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                .MuiTypography-root {
                    font-weight: 400;
                }

                .MuiAvatar-root {
                    height: 5rem;
                    width: 5rem;
                    margin: 0.5rem;
                    background-color: var(--primary);

                    .MuiSvgIcon-root {
                        height: 3rem;
                        width: 3rem;
                    }
                }
            }

            &:hover {
                background-color: var(--hover-opacity);
            }
        }
    }
`;

export const getServerSideProps: GetServerSideProps = async () => ({
    props: { namespacesRequired: includeDefaultNamespaces(['index']) },
});

export default withAuthSync(IndexPage);
