import { Box, Typography } from '@material-ui/core';
import { ButtonLink, LandingPageSearchWidget, MainLayout, Shortcut } from '../components';
import {
    CloudUploadOutlined,
    LibraryAddOutlined,
    SchoolOutlined,
    SupervisedUserCircleOutlined,
} from '@material-ui/icons';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { withApollo, withRedux } from '../lib';

import React from 'react';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../i18n';
import styled from 'styled-components';
import { useAuthSync } from '../utils';
import { useTranslation } from 'react-i18next';

const IndexPage: I18nPage = () => {
    const { t } = useTranslation();

    return (
        <MainLayout title={t('index:title')} disableSearch>
            <StyledIndexPage>
                <Box marginY="1rem">
                    <Typography variant="h1">{t('index:slogan')}</Typography>
                </Box>
                <Box marginY="2rem">
                    <LandingPageSearchWidget />
                </Box>
                <Box className="flex-flow" display="flex" justifyContent="center">
                    <Shortcut text={t('index:browseCourses')} icon={SchoolOutlined} href="/search" />
                    <Shortcut text={t('index:uploadResource')} icon={CloudUploadOutlined} href="/upload-resource" />
                    <Shortcut text={t('index:createCourse')} icon={LibraryAddOutlined} href="/create-course" />
                    <Shortcut text={t('index:users')} icon={SupervisedUserCircleOutlined} href="/users" />
                </Box>
                <Box marginY="1rem">
                    <Typography variant="h3">{t('index:contactUsText')}</Typography>
                    <ButtonLink href="/contact" variant="outlined" color="primary">
                        {t('index:contactUsButton')}
                    </ButtonLink>
                </Box>
            </StyledIndexPage>
        </MainLayout>
    );
};

const StyledIndexPage = styled(Box)`
    h1 {
        font-size: 2rem;
    }

    h3 {
        font-size: 1.25rem;
        margin-bottom: 1rem;
    }
`;

IndexPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['index']) };
};

export default compose(withApollo, withRedux)(IndexPage);
