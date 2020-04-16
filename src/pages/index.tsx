import { Box, Button, Card, CardContent, InputBase, Typography } from '@material-ui/core';
import {
    CloudUploadOutlined,
    ContactSupportOutlined,
    LibraryAddOutlined,
    SchoolOutlined,
    SearchOutlined,
    SupervisedUserCircleOutlined,
    SvgIconComponent,
} from '@material-ui/icons';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import styled from 'styled-components';

import { ButtonLink, MainLayout } from '../components';
import { includeDefaultNamespaces, Link, useTranslation } from '../i18n';
import { requireAuth, withAuthSync } from '../lib';
import { breakpoints } from '../styles';
import { I18nProps } from '../types';
import { useSearch } from '../utils';

interface Shortcut {
    text: string;
    icon: SvgIconComponent;
    href: string;
}

const shortcuts = [
    {
        text: 'index:browseCourses',
        icon: SchoolOutlined,
        href: '/search',
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
    {
        text: 'index:users',
        icon: SupervisedUserCircleOutlined,
        href: '/users',
    },
];

const IndexPage: NextPage<I18nProps> = () => {
    const { t } = useTranslation();
    const { searchValue, handleSubmit, handleChange, placeholder } = useSearch();

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
                <Box id="slogan">
                    <Typography variant="h1">{t('index:slogan')}</Typography>
                </Box>
                <Box id="search-widget" marginTop="1rem">
                    <form onSubmit={handleSubmit}>
                        <Box display="flex" justifyContent="center">
                            <Box className="search-input">
                                <InputBase placeholder={placeholder} onChange={handleChange} value={searchValue} />
                            </Box>
                            <Button type="submit" color="primary" variant="contained">
                                <SearchOutlined />
                            </Button>
                        </Box>
                    </form>
                </Box>
                <Box id="shortcuts" display="flex" justifyContent="center" marginTop="1rem">
                    {shortcuts.map(({ href, text, icon: Icon }: Shortcut, i: number) => (
                        <Link href={href} key={i}>
                            <Card>
                                <CardContent>
                                    <Icon color="primary" />
                                    <Typography variant="h2">{t(text)}</Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </Box>
                <Box marginTop="2rem">
                    <Typography variant="h3" gutterBottom>
                        {t('index:contactUsText')}
                    </Typography>
                </Box>
                <Box marginY="1rem">
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

    #slogan {
        margin-top: 1rem;

        @media only screen and (min-width: ${breakpoints.MD}) {
            margin-top: 4rem;
        }
    }

    #search-widget {
        .search-input {
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

                .MuiSvgIcon-root {
                    height: 5rem;
                    width: 5rem;
                    margin: 0.5rem;
                }
            }

            &:hover {
                background-color: var(--hover-opacity);
            }
        }
    }
`;

export const getServerSideProps: GetServerSideProps = requireAuth(async () => ({
    props: { namespacesRequired: includeDefaultNamespaces(['index']) },
}));

export default withAuthSync(IndexPage);
