import React from 'react';
import '../index.css';
import { Layout, TopHeader } from '../organisms';
import { ListSchools } from '../templates';

const SearchSchools: React.SFC<{}> = () => (
  <Layout title="skole | ebin oppimisalusta">
    <TopHeader />
    <ListSchools />
  </Layout>
);

export default SearchSchools;
