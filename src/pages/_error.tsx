import React from 'react';

import { NotFoundLayout } from '../components';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo } from '../lib';
import { I18nPage, I18nProps } from '../types';

const ErrorPage: I18nPage = () => <NotFoundLayout />;

ErrorPage.getInitialProps = (): I18nProps => ({
    namespacesRequired: includeDefaultNamespaces([]),
});

export default withApollo(ErrorPage);
