import React from 'react';
import { Layout, ListSchools } from '../components';
import '../index.css';

const SearchSchools: React.FC = () => (
  <Layout title="skole | ebin oppimisalusta">
    <ListSchools />
  </Layout>
);

export default SearchSchools;
