import React from 'react';
import { CardHeader } from '@material-ui/core';
import { Formik, Field } from 'formik';
import { NextPage } from 'next';
import { Router } from '../i18n';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { openNotification } from '../actions';
import {
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm,
  SubjectField,
  SchoolField,
  FormSubmitSection
} from '../components';
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
import { withTranslation } from '../i18n';
import { TextField } from 'formik-material-ui';

interface Props {
  subjects?: Subject[];
  schools?: School[];
  t: (value: string) => any;
}

const CreateCoursePage: NextPage<Props> = ({ subjects, schools, t }) => {
  const { ref, resetForm, setSubmitting, onError } = useForm(t);
  const dispatch = useDispatch();

  const onCompleted = async ({ createCourse }: FormCompleted) => {
    if (!!createCourse.errors) {
      onError(createCourse.errors);
    } else {
      resetForm();
      dispatch(openNotification(t('textCourseCreated')));
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

  const validationSchema = Yup.object().shape({
    courseName: Yup.string().required(t('fieldCourseNameRequired')),
    courseCode: Yup.string(),
    subjectId: Yup.string().required(t('fieldSubjectRequired')),
    schoolId: Yup.string().required(t('fieldSchoolRequired'))
  });

  return (
    <Layout t={t} title={t('titleCreateCourse')} backUrl="/">
      <StyledCard>
        <CardHeader title={t('headerCreateCourse')} />
        <SlimCardContent>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            ref={ref}
          >
            {props => (
              <StyledForm>
                <Field
                  name="courseName"
                  placeholder={t('fieldCourseName')}
                  label={t('fieldCourseName')}
                  component={TextField}
                  fullWidth
                />
                <Field
                  name="courseCode"
                  label={t('fieldCourseCode')}
                  placeholder={t('fieldCourseCode')}
                  component={TextField}
                  fullWidth
                />
                <SubjectField {...props} t={t} />
                <SchoolField {...props} t={t} />
                <FormSubmitSection submitButtonText={t('buttonSave')} {...props} />
              </StyledForm>
            )}
          </Formik>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

CreateCoursePage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  await usePrivatePage(ctx);

  try {
    const { data } = await ctx.apolloClient.query({ query: CreateCourseFormDataDocument });
    return { ...data, namespacesRequired: ['common'] };
  } catch {
    return { namespacesRequired: ['common'] };
  }
};

export default compose(withRedux, withApollo, withTranslation('common'))(CreateCoursePage);
