import React from 'react';
import { Background, Layout, ListSchools, TopHeader } from '../components';
import '../index.css';

const SearchSchools: React.SFC<{}> = () => (
  <Layout title="skole | ebin oppimisalusta">
    <TopHeader />
    <Background />
    <ListSchools />
  </Layout>
);

export default SearchSchools;
