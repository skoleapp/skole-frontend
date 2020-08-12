import { NotFoundLayout } from 'components';
import { includeDefaultNamespaces } from 'lib';
import { GetStaticProps } from 'next';
import React from 'react';

const NotFoundPage = (): JSX.Element => <NotFoundLayout />;

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces([]),
    },
});

export default NotFoundPage;
