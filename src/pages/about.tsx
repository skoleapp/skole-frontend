import { CardContent, CardHeader } from '@material-ui/core';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { Layout, StyledCard } from '../components';
import { withApollo, withRedux } from '../lib';

import React from 'react';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../i18n';
import { useAuthSync } from '../utils';
import { useTranslation } from 'react-i18next';

const AboutPage: I18nPage = () => {
    const { t } = useTranslation();

    return (
        <Layout title={t('about:title')} backUrl>
            <StyledCard>
                <CardHeader title={t('about:title')} />
                <CardContent>Here will wil about content...</CardContent>
            </StyledCard>
        </Layout>
    );
};

AboutPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['about']) };
};

export default compose(withApollo, withRedux)(AboutPage);
