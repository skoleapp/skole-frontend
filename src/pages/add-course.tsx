import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import {
  ActionRequiredTemplate,
  AutocompleteField,
  ContactLink,
  ErrorTemplate,
  FormSubmitSection,
  FormTemplate,
  GuidelinesLink,
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
import React, { useMemo } from 'react';
import { SeoPageProps } from 'types';
import { urls } from 'utils';
import * as Yup from 'yup';

interface CreateCourseFormValues {
  name: string;
  codes: string;
  subjects: SubjectObjectType[];
  school: SchoolObjectType | null;
}

const AddCoursePage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const { toggleNotification } = useNotificationsContext();
  const { t } = useTranslation();
  const { userMe, verified, school: _school } = useAuthContext();
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
    generalFormValues,
  } = useForm<CreateCourseFormValues>();

  // Pre-fill user's own school, if one exists and no other school is provided as a query parameter.
  const school = R.propOr(_school, 'school', data);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('validation:required')),
    school: Yup.object().nullable().required(t('validation:required')),
  });

  const onCompleted = async ({ createCourse }: CreateCourseMutation): Promise<void> => {
    if (createCourse?.errors?.length) {
      handleMutationErrors(createCourse.errors);
    } else if (!!createCourse?.course?.slug && !!createCourse?.successMessage) {
      formRef.current?.resetForm();
      toggleNotification(createCourse.successMessage);
      await Router.push(urls.course(createCourse.course.slug));
      sa_event('add_course');
    } else {
      setUnexpectedFormError();
    }
  };

  const [createCourse] = useCreateCourseMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmit = async ({
    name,
    codes,
    school: _school,
    subjects: _subjects,
  }: CreateCourseFormValues): Promise<void> => {
    const school = R.propOr('', 'id', _school);
    const subjects = _subjects.map((s) => s.id);

    const variables = {
      name,
      codes,
      school,
      subjects,
    };

    await createCourse({ variables });
  };

  // Only re-render when one of the dynamic values changes - the form values will reset every time.
  const initialValues = useMemo(
    () => ({
      ...generalFormValues,
      name: '',
      codes: '',
      school,
      subjects: [],
    }),
    [school],
  );

  const renderCourseNameField = (
    <Field
      name="name"
      label={t('forms:name')}
      component={TextFormField}
      helperText={t('add-course:nameHelperText')}
    />
  );

  const renderCodesField = (
    <Field
      name="codes"
      label={t('forms:codesOptional')}
      component={TextFormField}
      helperText={t('add-course:codeHelperText')}
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
      label={t('forms:subjectsOptional')}
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
      {renderCodesField}
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
      enableReinitialize
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
    return <ActionRequiredTemplate variant="login" {...layoutProps} />;
  }

  if (!verified) {
    return <ActionRequiredTemplate variant="verify-account" {...layoutProps} />;
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
