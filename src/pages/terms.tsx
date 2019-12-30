import { CardContent, CardHeader } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import { Layout, StyledCard } from '../components';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useAuthSync } from '../utils';

const TermsPage: I18nPage = () => {
    const { t } = useTranslation();

    return (
        <Layout title={t('terms:title')} backUrl>
            <StyledCard>
                <CardHeader title={t('terms:title')} />
                <CardContent>Here will be Terms and Conditions...</CardContent>
            </StyledCard>
        </Layout>
    );
};

TermsPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);

    return {
        namespacesRequired: includeDefaultNamespaces(['terms']),
    };
};

export default compose(withApollo, withRedux)(TermsPage);
