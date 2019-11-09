import { Button, Typography } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import React, { useState } from 'react';
import { compose } from 'redux';
import * as Yup from 'yup';
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

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required.'),
  code: Yup.string(),
  subject: Yup.string().required('Subject is required.'),
  school: Yup.string().required('School is required.')
});

const CreateCoursePage: NextPage<Props> = ({ data }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (
    values: CreateCourseFormValues,
    actions: FormikActions<CreateCourseFormValues>
  ) => {
    console.log(values);
    setSubmitted(true);
    actions.setSubmitting(false);
  };

  const initialValues = {
    name: '',
    code: '',
    subject: '',
    school: '',
    general: '',
    ...data
  };

  if (submitted) {
    return (
      <Layout title="Course Created!">
        <StyledCard>
          <Typography variant="h5">Course created!</Typography>
          <Button variant="contained" color="primary" fullWidth>
            go to course
          </Button>
          <Button variant="outlined" color="primary" fullWidth>
            back to home
          </Button>
        </StyledCard>
      </Layout>
    );
  }

  return (
    <Layout title="Create Course">
      <StyledCard>
        <Typography variant="h5">Create Course</Typography>
        <Formik
          initialValues={initialValues}
          component={CreateCourseForm}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
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

    const { schools } = data;

    const mockedData = {
      schools,
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
