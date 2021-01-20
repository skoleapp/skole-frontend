import { ErrorTemplate } from 'components';
import { loadNamespaces } from 'lib';
import { GetStaticProps } from 'next';
import React from 'react';

const NotFoundPage = (): JSX.Element => <ErrorTemplate variant="not-found" seoProps={{}} />;

export default NotFoundPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces([], locale),
  },
});
