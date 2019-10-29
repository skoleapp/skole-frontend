import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { withAuth } from '../../lib';
import { Layout } from '../../components/templates/Layout';
import { ListingPage } from '../../components';
//mock-data in json format
import { Universities, UAS, HighSchools } from '../../utils/schools';

const SchoolListPage: NextPage = () => (
  <Layout title="School List">
    <Typography variant="h5">School List</Typography>
    <Typography variant="body1">Here will be list of all schools.</Typography>
    <ListingPage Universities={Universities} UAS={UAS} HighSchools={HighSchools} />
  </Layout>
);

export default withAuth(SchoolListPage);
