import { NextPage } from 'next';
import React from 'react';
import { H1, MainLayout, Text } from '../components';
import { withAuthSync } from '../lib';

const SearchPage: NextPage = () => (
  <MainLayout title="Search">
    <H1>Search</H1>
    <Text>Search results will be show here.</Text>
  </MainLayout>
);

export default withAuthSync(SearchPage);
