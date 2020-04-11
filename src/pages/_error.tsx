import React from 'react';
import { compose } from 'redux';

import { NotFoundLayout } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps } from '../types';

const ErrorPage: I18nPage = () => {
    const { t } = useTranslation();

    return <NotFoundLayout title={t('_error:notFound')} />;
};

ErrorPage.getInitialProps = (): I18nProps => ({
    namespacesRequired: includeDefaultNamespaces([]),
});

export default compose(withApollo, withRedux)(ErrorPage);
