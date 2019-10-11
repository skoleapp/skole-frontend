import { NextPage, NextPageContext } from 'next';
import React from 'react';
import { getApiUrl, skoleAPI } from '../api';
import { H1, MainLayout } from '../components';
import { getQueryParams } from '../utils';

// FIXME: Add proper types for this
type SearchData = any; // eslint-disable-line @typescript-eslint/no-explicit-any

interface Props {
  data: SearchData;
}

const Search: NextPage<Props> = ({ data }) => {
  data && console.log(data);

  return (
    <MainLayout title="Search">
      <H1>Search</H1>
    </MainLayout>
  );
};

Search.getInitialProps = async (ctx: NextPageContext): Promise<SearchData> => {
  const { query } = ctx;
  const baseUrl = getApiUrl('search');
  const url = baseUrl + getQueryParams(query);

  try {
    const { data } = await skoleAPI.get(url);
    return { data };
  } catch (error) {
    // TODO: This should never happen, add logging?
    console.log(error);
  }
};

export default Search;
