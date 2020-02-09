import { Box, Button, Card, CardContent, InputBase, Typography } from '@material-ui/core';
import {
    CloudUploadOutlined,
    LibraryAddOutlined,
    SchoolOutlined,
    Search,
    SupervisedUserCircleOutlined,
    SvgIconComponent,
} from '@material-ui/icons';
import React from 'react';
import { compose } from 'redux';
import styled from 'styled-components';

import { ButtonLink, MainLayout } from '../components';
import { Link, useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { breakpoints } from '../styles';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useAuthSync, useSearch } from '../utils';

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

const IndexPage: I18nPage = () => {
    const { t } = useTranslation();
    const { searchValue, handleSubmit, handleChange, placeholder } = useSearch();

    const renderSearchWidget = (
        <form className="search-widget" onSubmit={handleSubmit}>
            <Box display="flex" justifyContent="center">
                <Box className="search-input">
                    <InputBase placeholder={placeholder} onChange={handleChange} value={searchValue} />
                </Box>
                <Button type="submit" color="primary" variant="contained">
                    <Search />
                </Button>
            </Box>
        </form>
    );

    return (
        <StyledIndexPage title={t('index:title')} disableSearch>
            <Box className="slogan">
                <Typography variant="h1">{t('index:slogan')}</Typography>
            </Box>
            <Box marginTop="1rem">{renderSearchWidget}</Box>
            <Box className="shortcuts" display="flex" justifyContent="center" marginTop="2rem">
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
            <Box marginTop="1rem">
                <ButtonLink href="/contact" variant="outlined" color="primary">
                    {t('index:contactUsButton')}
                </ButtonLink>
            </Box>
        </StyledIndexPage>
    );
};

const StyledIndexPage = styled(MainLayout)`
    @media only screen and (max-width: ${breakpoints.MD}) {
        padding: 0.5rem !important;
    }

    .slogan {
        margin-top: 1rem;

        @media only screen and (min-width: ${breakpoints.MD}) {
            margin-top: 4rem;
        }
    }

    .search-widget {
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

    .shortcuts {
        flex-flow: row wrap;

        .MuiCard-root {
            margin: 0.5rem;
            cursor: pointer;
            width: 14rem;
            height: 14rem;

            .MuiCardContent-root {
                height: 100%;
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

IndexPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['index']) };
};

export default compose(withApollo, withRedux)(IndexPage);
