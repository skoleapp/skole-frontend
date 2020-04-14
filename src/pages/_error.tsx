import { NextPage } from 'next';
import React from 'react';

import { NotFoundLayout } from '../components';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo } from '../lib';

const ErrorPage: NextPage = () => <NotFoundLayout />;

ErrorPage.getInitialProps = () => ({
    namespacesRequired: includeDefaultNamespaces([]),
});

export default withApollo(ErrorPage);
