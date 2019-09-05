import React from 'react';
import { Background } from '../components/atoms';
import { Layout, TopHeader } from '../components/organisms';
import { ListSchools } from '../components/templates';
import '../index.css';

const SearchSchools: React.SFC<{}> = () => (
  <Layout title="skole | ebin oppimisalusta">
    <TopHeader />
    <Background />
    <ListSchools />
  </Layout>
);

export default SearchSchools;
