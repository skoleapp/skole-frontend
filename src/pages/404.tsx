import { NotFoundTemplate } from 'components';
import { loadNamespaces } from 'lib';
import { GetStaticProps } from 'next';
import React from 'react';

const NotFoundPage = (): JSX.Element => <NotFoundTemplate />;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces([], locale),
  },
});

export default NotFoundPage;
