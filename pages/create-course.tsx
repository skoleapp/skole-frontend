import React from 'react';
import { CardHeader } from '@material-ui/core';
import { Formik } from 'formik';
import { NextPage } from 'next';
import { Router } from '../i18n';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { openNotification } from '../actions';
import { CreateCourseForm, Layout, SlimCardContent, StyledCard } from '../components';
import { CreateCourseFormDataDocument, useCreateCourseMutation } from '../generated/graphql';
import {
  CreateCourseFormValues,
  FormCompleted,
  School,
  SkoleContext,
  Subject
} from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useForm, usePrivatePage } from '../utils';

const validationSchema = Yup.object().shape({
  courseName: Yup.string().required('Course name is required.'),
  courseCode: Yup.string(),
  subjectId: Yup.string().required('Subject is required.'),
  schoolId: Yup.string().required('School is required.')
});

interface Props {
  subjects?: Subject[];
  schools?: School[];
}

const CreateCoursePage: NextPage<Props> = ({ subjects, schools }) => {
  const { ref, resetForm, setSubmitting, onError } = useForm();
  const dispatch = useDispatch();

  const onCompleted = async ({ createCourse }: FormCompleted) => {
    if (!!createCourse.errors) {
      onError(createCourse.errors);
    } else {
      resetForm();
      dispatch(openNotification('Course created!'));
      await Router.push(`/courses/${createCourse.course.id}`);
    }
  };

  const [createCourseMutation] = useCreateCourseMutation({ onCompleted, onError });

  const handleSubmit = (values: CreateCourseFormValues) => {
    const { courseName, courseCode, schoolId, subjectId } = values;
    createCourseMutation({ variables: { courseName, courseCode, schoolId, subjectId } });
    setSubmitting(false);
  };

  const initialValues = {
    courseName: '',
    courseCode: '',
    subjectId: '',
    schoolId: '',
    general: '',
    subjects: subjects || [],
    schools: schools || []
  };

  return (
    <Layout title="Create Course" backUrl="/">
      <StyledCard>
        <CardHeader title="Create Course" />
        <SlimCardContent>
          <Formik
            initialValues={initialValues}
            component={CreateCourseForm}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            ref={ref}
          />
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

CreateCoursePage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await usePrivatePage(ctx);

  try {
    const { data } = await ctx.apolloClient.query({ query: CreateCourseFormDataDocument });
    return { ...data };
  } catch {
    return {};
  }
};

export default compose(withRedux, withApollo)(CreateCoursePage);
