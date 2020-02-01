import { Box, Typography, InputBase, Button, CardContent, Card } from '@material-ui/core';
import {
    CloudUploadOutlined,
    LibraryAddOutlined,
    SchoolOutlined,
    SupervisedUserCircleOutlined,
    Search,
    SvgIconComponent,
} from '@material-ui/icons';
import React from 'react';
import { useTranslation, Link } from '../i18n';
import { compose } from 'redux';

import { ButtonLink, MainLayout } from '../components';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useAuthSync, useSearch } from '../utils';
import styled from 'styled-components';

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

    const renderShortcut = ({ href, text, icon: Icon }: Shortcut): JSX.Element => (
        <Link href={href}>
            <Card className="shortcut">
                <CardContent>
                    <Icon color="primary" />
                    <Typography variant="h2">{t(text)}</Typography>
                </CardContent>
            </Card>
        </Link>
    );

    return (
        <StyledIndexPage title={t('index:title')} disableSearch>
            <Box marginTop="1rem">
                <Typography variant="h1">{t('index:slogan')}</Typography>
            </Box>
            <Box marginTop="1rem">{renderSearchWidget}</Box>
            <Box className="flex-flow" display="flex" justifyContent="center" marginTop="2rem">
                {shortcuts.map((s: Shortcut) => renderShortcut(s))}
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

    .shortcut {
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
`;

IndexPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['index']) };
};

export default compose(withApollo, withRedux)(IndexPage);
