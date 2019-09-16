import React from 'react';
import { MainLayout, SearchPage } from '../components';

const Search: React.FC = () => (
  <MainLayout title="Search" secondary>
    <SearchPage />
  </MainLayout>
);

export default Search;
