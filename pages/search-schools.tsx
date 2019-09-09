import React from 'react';
import { ListSchools, MainLayout } from '../components';

const SearchSchools: React.FC = () => (
  <MainLayout title="Search Schools">
    <ListSchools />
  </MainLayout>
);

export default SearchSchools;
