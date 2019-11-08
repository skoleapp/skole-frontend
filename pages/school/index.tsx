import { Paper, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { StyledTable } from '../../components';
import { Layout, NotFoundCard } from '../../containers';
import { School } from '../../interfaces';
import { withAuthSync } from '../../utils';

interface Props {
  schools: School[] | null;
}

const SchoolListPage: NextPage<Props> = ({ schools }) => (
  <Layout title="School List">
    <Paper>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schools ? (
            schools.map((school: School, i: number) => (
              <Link href={`/school/${school.id}`} key={i}>
                <TableRow>
                  <TableCell className="main-cell">
                    <Typography variant="subtitle1">{school.name}</Typography>
                  </TableCell>
                </TableRow>
              </Link>
            ))
          ) : (
            <NotFoundCard text="No schools found..." />
          )}
        </TableBody>
      </StyledTable>
    </Paper>
  </Layout>
);

SchoolListPage.getInitialProps = async () => {
  return { schools: null };
};

export default withAuthSync(SchoolListPage as NextPage);
