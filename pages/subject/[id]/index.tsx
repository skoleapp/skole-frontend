import { NextPage } from 'next';
import React from 'react';
import { H1, MainLayout, Text } from '../../../components';

const SubjectDetailPage: NextPage = () => (
  <MainLayout title="Subject Detail">
    <H1>Subject Detail</H1>
    <Text>Here will be subject detail with list of schools providing that subject.</Text>
  </MainLayout>
);

export default SubjectDetailPage;
