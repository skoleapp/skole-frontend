import { NextPage } from 'next';
import React from 'react';
import { MainLayout, SearchPage } from '../components';
import { getApiUrl, skoleAPI } from '../utils';

// FIXME: Add proper types for this
interface Props {
  data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const Search: NextPage<Props> = ({ data }) => (
  <MainLayout title="Search">
    <SearchPage {...data} />
  </MainLayout>
);

// FIXME: Add proper types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Search.getInitialProps = async ({ query }): Promise<any> => {
  const baseUrl = getApiUrl('course');
  const url = baseUrl + `search/?${query.search}/`;
  try {
    const { data } = await skoleAPI.get(url);
    return { data };
  } catch (error) {
    console.log(error);
    return { data: null };
  }
};

export default Search;
