import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useRef } from 'react';
import { compose } from 'redux';
import * as Yup from 'yup';
import { LabelTag, StyledTable } from '../../components';
import { FilterSchoolsForm, Layout } from '../../containers';
import { SchoolsDocument } from '../../generated/graphql';
import { FilterSchoolsFormValues, School, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useSSRAuthSync } from '../../utils';

const validationSchema = Yup.object().shape({
  schoolType: Yup.string(),
  city: Yup.string(),
  country: Yup.string(),
  name: Yup.string()
});

interface Props {
  schools?: School[];
}

const SchoolsPage: NextPage<Props> = ({ schools }) => {
  const router = useRouter();
  const { query, pathname } = router;
  const ref = useRef<any>(); // eslint-disable-line @eslint/typescript-no-explicit-any
  const { schoolType, schoolCity, schoolCountry, schoolName } = query;

  // Pick non-empty values and reload the page with new query params.
  const handleSubmit = (
    values: FilterSchoolsFormValues,
    actions: FormikActions<FilterSchoolsFormValues>
  ) => {
    const isNotEmpty = (val: string) => val !== '';
    const query: any = R.pickBy(isNotEmpty, values); // eslint-disable-line @eslint/typescript-no-explicit-any
    router.push({ pathname, query });
    actions.setSubmitting(false);
  };

  // Wait for the router to clear the query params, then reset the form.
  const handleClearFilters = async () => {
    await router.push(pathname);
    ref.current.resetForm();
  };

  // Pre-load query params to the form.
  const initialValues = {
    schoolType: schoolType || '',
    schoolName: schoolName || '',
    schoolCity: schoolCity || '',
    schoolCountry: schoolCountry || ''
  };

  return (
    <Layout heading="Schools" title="Schools" backUrl="/">
      <StyledTable>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography variant="h6">Filter Schools</Typography>
                <Formik
                  component={FilterSchoolsForm}
                  onSubmit={handleSubmit}
                  validationSchema={validationSchema}
                  initialValues={initialValues}
                  ref={ref}
                />
                <Button variant="outlined" color="primary" fullWidth onClick={handleClearFilters}>
                  clear filters
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schools && schools.length ? (
              schools.map((school: School, i: number) => (
                <Link href={`/schools/${school.id}`} key={i}>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1">{school.name}</Typography>
                      <LabelTag text={school.schoolType} />
                    </TableCell>
                  </TableRow>
                </Link>
              ))
            ) : (
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1">No schools...</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTable>
    </Layout>
  );
};

SchoolsPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useSSRAuthSync(ctx);
  const { query, apolloClient } = ctx;

  try {
    const { data } = await apolloClient.query({ query: SchoolsDocument, variables: { ...query } });
    return { ...data };
  } catch {
    return {};
  }
};

export default compose(withRedux, withApollo)(SchoolsPage);
