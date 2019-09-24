import { NextPage } from 'next';
import React from 'react';
import { getApiUrl } from '../api';
import { MainLayout, SearchPage } from '../components';
import { useSearch } from '../components/hooks/useSearch';
import { LoadingScreen } from '../components/layout';

// FIXME: Add proper types for this
interface Props {
  url: string; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const Search: NextPage<Props> = ({ url }) => {
  const [results, loading] = useSearch(url);

  if (loading) {
    return <LoadingScreen loadingText="Loading results..." />;
  }

  return (
    <MainLayout title="Search">
      <SearchPage {...results} />
    </MainLayout>
  );
};

interface URLProps {
  url: string;
}

const getQueryParams = ({ search, school_type }: any) => {
  if (search) {
    return `?search=${search}`;
  }

  if (school_type) {
    return `?search=${school_type}`;
  }
};

// FIXME: Add proper types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Search.getInitialProps = async ({ query }): Promise<URLProps> => {
  const baseUrl = getApiUrl('course');
  const url = baseUrl + getQueryParams(query);
  console.log(url);
  return { url };
};

export default Search;
