import React from 'react';
import '../index.css';
import { Layout } from '../organisms/Layout';
import { ListSchools } from '../templates';
import TopHeader from '../organisms/TopHeader';

const SearchSchools: React.SFC<{}> = () => (
  <Layout title="skole | ebin oppimisalusta">
    <TopHeader />
    <ListSchools />
  </Layout>
);

export default SearchSchools;
