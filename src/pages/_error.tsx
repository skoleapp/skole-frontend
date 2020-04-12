import React from 'react';
import { compose } from 'redux';

import { NotFoundLayout } from '../components';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps } from '../types';

const ErrorPage: I18nPage = () => <NotFoundLayout />;

ErrorPage.getInitialProps = (): I18nProps => ({
    namespacesRequired: includeDefaultNamespaces([]),
});

export default compose(withApollo, withRedux)(ErrorPage);
