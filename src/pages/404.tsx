import { ErrorTemplate } from 'components';
import { withUserMe } from 'hocs';
import { loadNamespaces } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';

const NotFoundPage: NextPage = () => <ErrorTemplate variant="not-found" />;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces([], locale),
  },
});

export default withUserMe(NotFoundPage);
