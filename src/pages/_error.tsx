import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import { NotFoundLayout } from '../components';
import { includeDefaultNamespaces } from '../i18n';
import { I18nProps } from '../types';

const ErrorPage: NextPage<I18nProps> = () => <NotFoundLayout />;

export const getServerSideProps: GetServerSideProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces([]),
    },
});

export default ErrorPage;
