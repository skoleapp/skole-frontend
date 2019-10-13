import { NextPage, NextPageContext } from 'next';
import React from 'react';
import { H1, MainLayout } from '../components';

// FIXME: Add proper types for this
type SearchData = any; // eslint-disable-line @typescript-eslint/no-explicit-any

interface Props {
  data: SearchData;
}

const SearchPage: NextPage<Props> = () => (
  <MainLayout title="Search">
    <H1>Search</H1>
  </MainLayout>
);

SearchPage.getInitialProps = async (ctx: NextPageContext): Promise<SearchData> => {
  return {};
};

export default SearchPage;
