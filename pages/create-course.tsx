import { CardContent, CardHeader } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { openNotification } from '../actions';
import { CreateCourseForm, Layout, StyledCard } from '../components';
import { SchoolsAndSubjectsDocument, useCreateCourseMutation } from '../generated/graphql';
import { CreateCourseFormValues, School, SkoleContext, Subject } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useForm, usePrivatePage } from '../utils';

interface Props {
  subjects?: Subject[];
  schools?: School[];
}

const validationSchema = Yup.object().shape({
  courseName: Yup.string().required('Course name is required.'),
  courseCode: Yup.string(),
  subjectId: Yup.string().required('Subject is required.'),
  schoolId: Yup.string().required('School is required.')
});

const CreateCoursePage: NextPage<Props> = ({ schools, subjects }) => {
  const { ref, onError } = useForm();
  const dispatch = useDispatch();
  const router = useRouter();

  // eslint-disable-next-line
  const onCompleted = ({ createCourse }: any) => {
    if (!!createCourse.errors) {
      onError(createCourse.errors); // eslint-disable-line @typescript-eslint/no-use-before-define
    } else {
      dispatch(openNotification('Course created!'));
      router.push(`/courses/${createCourse.course.id}`);
    }
  };

  const [createCourseMutation] = useCreateCourseMutation({ onCompleted, onError });

  const handleSubmit = async (
    values: CreateCourseFormValues,
    actions: FormikActions<CreateCourseFormValues>
  ) => {
    const { courseName, courseCode, schoolId, subjectId } = values;
    await createCourseMutation({ variables: { courseName, courseCode, schoolId, subjectId } });
    actions.setSubmitting(false);
  };

  const initialValues = {
    courseName: '',
    courseCode: '',
    subjectId: '',
    schoolId: '',
    general: '',
    schools: schools || [],
    subjects: subjects || []
  };

  return (
    <Layout title="Create Course" backUrl="/">
      <StyledCard>
        <CardHeader title="Create Course" />
        <CardContent>
          <Formik
            initialValues={initialValues}
            component={CreateCourseForm}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            ref={ref}
          />
        </CardContent>
      </StyledCard>
    </Layout>
  );
};

CreateCoursePage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await usePrivatePage(ctx);

  try {
    const { data } = await ctx.apolloClient.query({
      query: SchoolsAndSubjectsDocument
    });

    return { ...data };
  } catch {
    return {};
  }
};

export default compose(withRedux, withApollo)(CreateCoursePage);
