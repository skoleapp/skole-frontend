import { ErrorTemplate } from 'components';
import { loadNamespaces } from 'lib';
import { GetStaticProps } from 'next';
import React from 'react';

export default (): JSX.Element => <ErrorTemplate variant="not-found" />;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces([], locale),
  },
});
