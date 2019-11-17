import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { openNotification } from '../actions';
import { StyledCard } from '../components';
import { CreateCourseForm, Layout } from '../containers';
import { SchoolsAndSubjectsDocument, useCreateCourseMutation } from '../generated/graphql';
import { CreateCourseFormValues, School, SkoleContext, Subject } from '../interfaces';
import { createFormErrors, useSSRAuthSync, withPrivate } from '../utils';

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
  const ref = useRef<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch();
  const router = useRouter();

  // eslint-disable-next-line
  const onCompleted = ({ createCourse }: any) => {
    if (!!createCourse.errors) {
      onError(createCourse.errors); // eslint-disable-line @typescript-eslint/no-use-before-define
    } else {
      dispatch(openNotification('Course created!'));
      router.push(`/course/${createCourse.course.id}`);
    }
  };

  // eslint-disable-next-line
  const onError = (errors: any) => {
    console.log({ ...errors });
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

  return (
    <Layout heading="Create Course" title="Create Course" backUrl="/">
      <StyledCard>
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
  } catch (err) {
    return {};
  }
};

export default withPrivate(CreateCoursePage);
