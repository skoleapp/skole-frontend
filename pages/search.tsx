import { NextPage } from 'next';
import React from 'react';
import { MainLayout, SearchPage } from '../components';
import { getApiUrl, skoleAPI } from '../utils';

// FIXME: Add proper types for this
interface Props {
  data: any; // eslint-disable-line no-explicit-any
}

const Search: NextPage<Props> = ({ data }) => (
  <MainLayout title="Search">
    <SearchPage {...data} />
  </MainLayout>
);

Search.getInitialProps = async ({ query }) => {
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
