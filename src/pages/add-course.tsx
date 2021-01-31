import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import {
  AutocompleteField,
  ContactLink,
  ErrorTemplate,
  FormSubmitSection,
  FormTemplate,
  GuidelinesLink,
  LoginRequiredTemplate,
  TextFormField,
} from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  AutocompleteSchoolsDocument,
  AutocompleteSubjectsDocument,
  CreateCourseMutation,
  SchoolObjectType,
  SubjectObjectType,
  useCreateCourseAutocompleteDataQuery,
  useCreateCourseMutation,
} from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useEffect } from 'react';
import { SeoPageProps } from 'types';
import { urls } from 'utils';
import * as Yup from 'yup';

interface CreateCourseFormValues {
  courseName: string;
  courseCode: string;
  subjects: SubjectObjectType[];
  school: SchoolObjectType | null;
  general: string;
}

const AddCoursePage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const { toggleNotification } = useNotificationsContext();
  const { t } = useTranslation();
  const { userMe, school: _school } = useAuthContext();
  const { query } = useRouter();
  const context = useLanguageHeaderContext();
  const variables = R.pick(['school'], query);

  const { data, error } = useCreateCourseAutocompleteDataQuery({
    variables,
    context,
  });

  const {
    formRef,
    handleMutationErrors,
    onError,
    setUnexpectedFormError,
  } = useForm<CreateCourseFormValues>();

  // Prefill user's own school, if one exists and no other school is provided as a query parameter.
  const school = R.propOr(_school, 'school', data);

  useEffect(() => {
    formRef.current?.setFieldValue('school', school);
  }, [school]);

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
        formRef.current?.resetForm();
        toggleNotification(createCourse.successMessage);
        await Router.push(urls.course(createCourse.course.id));
        sa_event('add_course');
      } else {
        setUnexpectedFormError();
      }
    } else {
      setUnexpectedFormError();
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

  const renderCourseNameField = (
    <Field
      name="courseName"
      label={t('forms:courseName')}
      component={TextFormField}
      helperText={t('add-course:courseNameHelperText')}
    />
  );

  const renderCourseCodeField = (
    <Field
      name="courseCode"
      label={t('forms:courseCodeOptional')}
      component={TextFormField}
      helperText={t('add-course:courseCodeHelperText')}
    />
  );

  const renderSchoolField = (
    <Field
      name="school"
      label={t('forms:school')}
      dataKey="autocompleteSchools"
      searchKey="name"
      document={AutocompleteSchoolsDocument}
      component={AutocompleteField}
      helperText={t('add-course:schoolHelperText')}
    />
  );

  const renderSubjectsField = (
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
  );

  const renderGuidelinesLink = (
    <FormControl>
      <FormHelperText>
        {t('add-course:guidelinesInfo')} <GuidelinesLink />.
      </FormHelperText>
    </FormControl>
  );

  const renderFormSubmitSection = (props: FormikProps<CreateCourseFormValues>): JSX.Element => (
    <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
  );

  const renderContactUsLink = <ContactLink />;

  const renderFormFields = (props: FormikProps<CreateCourseFormValues>): JSX.Element => (
    <Form>
      {renderCourseNameField}
      {renderCourseCodeField}
      {renderSchoolField}
      {renderSubjectsField}
      {renderGuidelinesLink}
      {renderFormSubmitSection(props)}
      {renderContactUsLink}
    </Form>
  );

  const renderForm = (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      innerRef={formRef}
    >
      {renderFormFields}
    </Formik>
  );

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: t('add-course:header'),
      emoji: '🎓',
    },
  };

  if (!userMe) {
    return <LoginRequiredTemplate {...layoutProps} />;
  }

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" seoProps={seoProps} />;
  }

  if (error) {
    return <ErrorTemplate variant="error" seoProps={seoProps} />;
  }

  return <FormTemplate {...layoutProps}>{renderForm}</FormTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'add-course');

  return {
    props: {
      _ns: await loadNamespaces(['add-course'], locale),
      seoProps: {
        title: t('title'),
        description: t('description'),
      },
    },
  };
};

export default withUserMe(AddCoursePage);
