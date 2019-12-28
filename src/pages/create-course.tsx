import { CardHeader, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { ErrorMessage, Field, Formik, FormikProps } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { CreateCourseInitialDataDocument, useCreateCourseMutation } from '../../generated/graphql';
import { openNotification } from '../actions';
import {
  FormErrorMessage,
  FormSubmitSection,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm
} from '../components';
import { includeDefaultNamespaces, Router } from '../i18n';
import { withApollo, withRedux } from '../lib';
import {
  CreateCourseFormValues,
  FormCompleted,
  I18nPage,
  I18nProps,
  School,
  SkoleContext,
  Subject
} from '../types';
import { useForm, usePrivatePage } from '../utils';

interface Props extends I18nProps {
  subjects?: Subject[];
  schools?: School[];
}

const CreateCoursePage: I18nPage<Props> = ({ subjects, schools }) => {
  const { ref, resetForm, setSubmitting, onError } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    courseName: Yup.string().required(t('validation:courseNameRequired')),
    courseCode: Yup.string(),
    subject: Yup.string().required(t('validation:subjectRequired')),
    school: Yup.string().required(t('validation:schoolRequired'))
  });

  const onCompleted = async ({ createCourse }: FormCompleted) => {
    if (!!createCourse.errors) {
      onError(createCourse.errors);
    } else {
      resetForm();
      dispatch(openNotification(t('notifications:courseCreated')));
      await Router.push(`/courses/${createCourse.course.id}`);
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
        placeholder={t('forms:courseName')}
        label={t('forms:courseName')}
        component={TextField}
        fullWidth
      />
      <Field
        name="courseCode"
        placeholder={t('forms:courseCode')}
        label={t('forms:courseCode')}
        component={TextField}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel>{t('forms:subject')}</InputLabel>
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
        <InputLabel>{t('forms:school')}</InputLabel>
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
      <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
    </StyledForm>
  );

  return (
    <Layout title={t('create-course:title')} backUrl>
      <StyledCard>
        <CardHeader title={t('create-course:title')} />
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
    return { ...data, namespacesRequired: includeDefaultNamespaces(['create-course']) };
  } catch {
    return { namespacesRequired: includeDefaultNamespaces(['create-course']) };
  }
};

export default compose(withRedux, withApollo)(CreateCoursePage);
