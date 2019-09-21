import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MainLayout, SearchPage } from '../components';
import { LoadingScreen } from '../components/layout';
import { State } from '../interfaces';
import { search } from '../redux';
import { getApiUrl } from '../utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useSearch = (url: string): any => {
  const { results, loading } = useSelector((state: State) => state.search);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(search(url));
  }, []);

  return [results, loading];
};

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

// FIXME: Add proper types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Search.getInitialProps = async ({ query }): Promise<URLProps> => {
  const baseUrl = getApiUrl('course');
  const url = baseUrl + `search/?${query.search}/`;
  return { url };
};

export default Search;
