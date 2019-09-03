import React from 'react';
import '../index.css';
import { Layout, TopHeader } from '../organisms';
import { ListSchools } from '../templates';
import { Background } from '../atoms';

const SearchSchools: React.SFC<{}> = () => (
  <Layout title="skole | ebin oppimisalusta">
    <TopHeader />
    <Background />
    <ListSchools />
  </Layout>
);

export default SearchSchools;
