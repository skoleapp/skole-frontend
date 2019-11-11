import { Button, Typography } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import React, { useRef, useState } from 'react';
import { compose } from 'redux';
import * as Yup from 'yup';
import { ButtonLink, StyledCard } from '../components';
import { CreateCourseForm, Layout } from '../containers';
import { SchoolsAndSubjectsDocument, useCreateCourseMutation } from '../generated/graphql';
import { Course, CreateCourseFormValues, School, SkoleContext, Subject } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { createFormErrors, useSSRAuthSync } from '../utils';

interface Props {
  subjects?: Subject[];
  schools?: School[];
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required.'),
  code: Yup.string(),
  subject: Yup.string().required('Subject is required.'),
  school: Yup.string().required('School is required.')
});

const CreateCoursePage: NextPage<Props> = ({ schools, subjects }) => {
  const [createdCourse, setCreatedCourse] = useState<Course | null>(null);
  const ref = useRef<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any

  // eslint-disable-next-line
  const onCompleted = ({ createCourse }: any) => {
    if (createCourse.errors) {
      return onError(createCourse.errors); // eslint-disable-line @typescript-eslint/no-use-before-define
    }

    setCreatedCourse(createCourse.course);
  };

  // eslint-disable-next-line
  const onError = (errors: any) => {
    const formErrors = createFormErrors(errors);
    Object.keys(formErrors).forEach(
      key => ref.current.setFieldError(key, (formErrors as any)[key]) // eslint-disable-line @typescript-eslint/no-explicit-any
    );
  };

  const [createCourseMutation] = useCreateCourseMutation({ onCompleted, onError });

  const handleSubmit = async (
    values: CreateCourseFormValues,
    actions: FormikActions<CreateCourseFormValues>
  ) => {
    const { name, code, school, subject } = values;
    await createCourseMutation({ variables: { name, code, school, subject } });
    actions.setSubmitting(false);
  };

  const initialValues = {
    name: '',
    code: '',
    subject: '',
    school: '',
    general: '',
    schools,
    subjects
  };

  if (createdCourse) {
    const { name, id } = createdCourse;

    return (
      <Layout title="Course Created!">
        <StyledCard>
          <Typography variant="h5">{name} created!</Typography>
          <ButtonLink href={`/course/${id}`} variant="contained" color="primary" fullWidth>
            go to course
          </ButtonLink>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={(): void => setCreatedCourse(null)}
          >
            create another course
          </Button>
          <ButtonLink href="/" variant="outlined" color="primary" fullWidth>
            back to home
          </ButtonLink>
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
          ref={ref}
        />
      </StyledCard>
    </Layout>
  );
};

CreateCoursePage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useSSRAuthSync(ctx);

  try {
    const { data } = await ctx.apolloClient.query({
      query: SchoolsAndSubjectsDocument
    });

    const { schools, subjects } = data;
    return { schools, subjects };
  } catch {
    return {};
  }
};

export default compose(withRedux, withApollo)(CreateCoursePage);
