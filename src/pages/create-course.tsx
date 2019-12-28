import { CardHeader, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { ErrorMessage, Field, Formik, FormikProps } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { CreateCourseInitialDataDocument, useCreateCourseMutation } from '../../generated/graphql';
import { openNotification } from '../actions';
import { FormErrorMessage, FormSubmitSection, Layout, SlimCardContent, StyledCard, StyledForm } from '../components';
import { withApollo, withRedux } from '../lib';
import { CreateCourseFormValues, FormCompleted, School, SkoleContext, Subject } from '../types';
import { useForm, usePrivatePage } from '../utils';

const validationSchema = Yup.object().shape({
  courseName: Yup.string().required('Course name is required.'),
  courseCode: Yup.string(),
  subject: Yup.string().required('Subject is required.'),
  school: Yup.string().required('School is required.')
});

interface Props {
  subjects?: Subject[];
  schools?: School[];
}

const CreateCoursePage: NextPage<Props> = ({ subjects, schools }) => {
  const { ref, resetForm, setSubmitting, onError } = useForm();
  const dispatch = useDispatch();
  const router = useRouter();

  const onCompleted = async ({ createCourse }: FormCompleted) => {
    if (!!createCourse.errors) {
      onError(createCourse.errors);
    } else {
      resetForm();
      dispatch(openNotification('Course created!'));
      await router.push(`/courses/${createCourse.course.id}`);
    }
  };

  const [createCourseMutation] = useCreateCourseMutation({ onCompleted, onError });

  const handleSubmit = (values: CreateCourseFormValues) => {
    const { courseName, courseCode, school, subject } = values;
    createCourseMutation({ variables: { courseName, courseCode, school, subject } });
    setSubmitting(false);
  };

  const initialValues = {
    courseName: '',
    courseCode: '',
    subject: '',
    school: '',
    general: ''
  };

  const renderForm = (props: FormikProps<CreateCourseFormValues>) => (
    <StyledForm>
      <Field
        name="courseName"
        placeholder="Course Name"
        label="Course Name"
        component={TextField}
        fullWidth
      />
      <Field
        name="courseCode"
        placeholder="Course Code"
        label="Course Code"
        component={TextField}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel>Subject</InputLabel>
        <Field name="subject" component={Select}>
          <MenuItem value="">---</MenuItem>
          {subjects &&
            subjects.map((s: Subject, i: number) => (
              <MenuItem key={i} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
        </Field>
        <ErrorMessage name="subject" component={FormErrorMessage} />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>School</InputLabel>
        <Field name="school" component={Select}>
          <MenuItem value="">---</MenuItem>
          {schools &&
            schools.map((s: School, i: number) => (
              <MenuItem key={i} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
        </Field>
        <ErrorMessage name="school" component={FormErrorMessage} />
      </FormControl>
      <FormSubmitSection submitButtonText="save" {...props} />
    </StyledForm>
  );

  return (
    <Layout title="Create Course" backUrl>
      <StyledCard>
        <CardHeader title="Create Course" />
        <SlimCardContent>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            ref={ref}
          >
            {renderForm}
          </Formik>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

CreateCoursePage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await usePrivatePage(ctx);

  try {
    const { data } = await ctx.apolloClient.query({ query: CreateCourseInitialDataDocument });
    return { ...data };
  } catch {
    return {};
  }
};

export default compose(withRedux, withApollo)(CreateCoursePage);
