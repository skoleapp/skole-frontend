import axios from 'axios';
import { NextPage } from 'next';
import React from 'react';
import { Background, LandingPage, Layout, TopHeader } from '../components';
import '../index.css';

interface Data {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
}

interface Props {
  data: Data;
}

const Index: NextPage<Props> = ({ data }) => {
  console.log(data);

  return (
    <Layout title="skole | ebin oppimisalusta">
      <TopHeader />
      <Background />
      <LandingPage />
    </Layout>
  );
};

// Fetch data like this
Index.getInitialProps = async (): Promise<Props> => {
  // Get API URL from API utils
  // const url = getApiUrl('get-user');

  // Use real URL here
  const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
  return { data: res.data };
};

export default Index;
