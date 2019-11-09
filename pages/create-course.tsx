import { Typography } from '@material-ui/core';
import { Formik } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { StyledCard } from '../components';
import { CreateCourseForm, Layout } from '../containers';
import { SchoolsDocument } from '../generated/graphql';
import { CreateCourseFormValues, School, SkoleContext, Subject } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useSSRAuthSync } from '../utils';

interface Data {
  subjects: Subject[];
  schools: School[];
}

interface Props {
  data: Data | null;
}

const initialValues = {
  name: '',
  code: '',
  subject: '',
  school: ''
};

const CreateCoursePage: NextPage<Props> = ({ data }) => {
  const handleSubmit = (
    values: CreateCourseFormValues
    // actions: FormikActions<CreateCourseFormValues>
  ) => {
    console.log(values);
  };

  return (
    <Layout title="Create Course">
      <StyledCard>
        <Typography variant="h5">Create Course</Typography>
        <Formik
          initialValues={initialValues}
          component={CreateCourseForm}
          onSubmit={handleSubmit}
          {...data}
        />
      </StyledCard>
    </Layout>
  );
};

CreateCoursePage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useSSRAuthSync(ctx);

  try {
    const { data } = await ctx.apolloClient.query({
      // query: SubjectListDocument
      query: SchoolsDocument
    });

    // Use mocked data for now.
    const subjectList = [
      {
        id: 0,
        name: 'Computer Engineering'
      },
      {
        id: 2,
        name: 'Computer Science'
      }
    ];

    const mockedData = {
      schools: data.schoolList,
      subjects: subjectList
    };

    return { data: mockedData };
  } catch {
    return { data: null };
  }
};

export default compose(
  withRedux,
  withApollo
)(CreateCoursePage);
