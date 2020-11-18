import { ErrorLayout } from 'components';
import { loadNamespaces } from 'lib';
import { GetStaticProps } from 'next';
import React from 'react';

const ErrorPage = (): JSX.Element => <ErrorLayout />;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces([], locale),
  },
});

export default ErrorPage;
