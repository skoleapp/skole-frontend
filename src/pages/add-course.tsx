import {
  AutocompleteField,
  ErrorTemplate,
  FormTemplate,
  FormSubmitSection,
  OfflineTemplate,
  TextFormField,
} from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik } from 'formik';
import {
  AutocompleteSchoolsDocument,
  AutocompleteSubjectsDocument,
  CreateCourseMutation,
  SchoolObjectType,
  SubjectObjectType,
  useCreateCourseAutocompleteDataQuery,
  useCreateCourseMutation,
} from 'generated';
import { withAuth } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { urls } from 'utils';
import * as Yup from 'yup';

interface CreateCourseFormValues {
  courseName: string;
  courseCode: string;
  subjects: SubjectObjectType[];
  school: SchoolObjectType | null;
  general: string;
}

const AddCoursePage: NextPage = () => {
  const { toggleNotification } = useNotificationsContext();
  const { t } = useTranslation();
  const { query } = useRouter();
  const context = useLanguageHeaderContext();
  const variables = R.pick(['school'], query);

  const { data, error } = useCreateCourseAutocompleteDataQuery({
    variables,
    context,
  });

  const school = R.propOr(null, 'school', data);

  const {
    formRef,
    resetForm,
    handleMutationErrors,
    onError,
    unexpectedError,
  } = useForm<CreateCourseFormValues>();

  const validationSchema = Yup.object().shape({
    courseName: Yup.string().required(t('validation:required')),
    courseCode: Yup.string(),
    subjects: Yup.mixed(),
    school: Yup.object().nullable().required(t('validation:required')),
  });

  const onCompleted = async ({ createCourse }: CreateCourseMutation): Promise<void> => {
    if (createCourse) {
      if (!!createCourse.errors && !!createCourse.errors.length) {
        handleMutationErrors(createCourse.errors);
      } else if (!!createCourse.course && !!createCourse.successMessage) {
        resetForm();
        toggleNotification(createCourse.successMessage);
        await Router.push(urls.course(createCourse.course.id));
      } else {
        unexpectedError();
      }
    } else {
      unexpectedError();
    }
  };

  const [createCourse] = useCreateCourseMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmit = async (values: CreateCourseFormValues): Promise<void> => {
    const { courseName, courseCode, school: _school, subjects: _subjects } = values;

    const school = R.propOr('', 'id', _school);
    const subjects = _subjects.map((s) => s.id);

    const variables = {
      courseName,
      courseCode,
      school,
      subjects,
    };

    await createCourse({ variables });
  };

  const initialValues = {
    courseName: '',
    courseCode: '',
    school,
    subjects: [],
    general: '',
  };

  const renderForm = (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      innerRef={formRef}
      enableReinitialize
    >
      {(props): JSX.Element => (
        <Form>
          <Field
            name="courseName"
            label={t('forms:courseName')}
            component={TextFormField}
            helperText={t('add-course:courseNameHelperText')}
          />
          <Field
            name="courseCode"
            label={t('forms:courseCodeOptional')}
            component={TextFormField}
            helperText={t('add-course:courseCodeHelperText')}
          />
          <Field
            name="school"
            label={t('forms:school')}
            dataKey="autocompleteSchools"
            searchKey="name"
            document={AutocompleteSchoolsDocument}
            component={AutocompleteField}
            helperText={t('add-course:schoolHelperText')}
          />
          <Field
            name="subjects"
            label={t('forms:subjects')}
            searchKey="name"
            dataKey="autocompleteSubjects"
            document={AutocompleteSubjectsDocument}
            component={AutocompleteField}
            helperText={t('add-course:subjectsHelperText')}
            multiple
          />
          <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
        </Form>
      )}
    </Formik>
  );

  const layoutProps = {
    seoProps: {
      title: t('add-course:title'),
      description: t('add-course:description'),
    },
    header: t('add-course:header'),
    topNavbarProps: {
      dynamicBackUrl: true,
    },
  };

  if (!!error && !!error.networkError) {
    return <OfflineTemplate />;
  }
  if (error) {
    return <ErrorTemplate />;
  }

  return <FormTemplate {...layoutProps}>{renderForm}</FormTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['add-course'], locale),
  },
});

export default withAuth(AddCoursePage);
