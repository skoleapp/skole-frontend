import { Collapse } from '@material-ui/core';
import {
  AutocompleteField,
  ErrorTemplate,
  FileField,
  FormTemplate,
  FormSubmitSection,
  OfflineTemplate,
  TextFormField,
  TextLink,
} from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  AutocompleteCoursesDocument,
  AutocompleteResourceTypesDocument,
  AutocompleteSchoolsDocument,
  CourseObjectType,
  CreateResourceMutation,
  SchoolObjectType,
  useCreateResourceAutocompleteDataQuery,
  useCreateResourceMutation,
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

interface UploadResourceFormValues {
  resourceTitle: string;
  resourceType: string;
  school: SchoolObjectType | null;
  course: CourseObjectType | null;
  file: File | null;
}

const UploadResourcePage: NextPage = () => {
  const { query } = useRouter();
  const { toggleNotification } = useNotificationsContext();
  const { t } = useTranslation();
  const context = useLanguageHeaderContext();
  const variables = R.pick(['school', 'course'], query);

  const { data, error } = useCreateResourceAutocompleteDataQuery({
    variables,
    context,
  });

  const school = R.propOr(null, 'school', data);
  const course = R.propOr(null, 'course', data);

  const {
    formRef,
    onError,
    resetForm,
    handleMutationErrors,
    setFieldValue,
    unexpectedError,
  } = useForm<UploadResourceFormValues>();

  const validationSchema = Yup.object().shape({
    resourceTitle: Yup.string().required(t('validation:required')),
    resourceType: Yup.object().nullable().required(t('validation:required')),
    school: Yup.object().nullable().required(t('validation:required')),
    course: Yup.object().nullable().required(t('validation:required')),
    file: Yup.mixed().required(t('validation:required')),
  });

  const onCompleted = async ({ createResource }: CreateResourceMutation): Promise<void> => {
    if (createResource) {
      if (!!createResource.errors && !!createResource.errors.length) {
        handleMutationErrors(createResource.errors);
      } else if (
        !!createResource.resource &&
        !!createResource.resource.id &&
        !!createResource.successMessage
      ) {
        resetForm();
        toggleNotification(createResource.successMessage);
        await Router.push(urls.resource(createResource.resource.id));
      } else {
        unexpectedError();
      }
    } else {
      unexpectedError();
    }
  };

  const [createResource] = useCreateResourceMutation({
    onCompleted,
    onError,
    context,
  });

  const handleUpload = async ({
    resourceTitle,
    resourceType: _resourceType,
    course: _course,
    file,
  }: UploadResourceFormValues): Promise<void> => {
    const resourceType = R.propOr('', 'id', _resourceType);
    const course = R.propOr('', 'id', _course);

    const variables = {
      resourceTitle,
      resourceType,
      course,
      file,
    };

    setFieldValue('general', t('upload-resource:fileUploadingText'));

    // @ts-ignore: A string value is expected for the file field, which is incorrect.
    await createResource({ variables });
  };

  const initialValues = {
    resourceTitle: '',
    resourceType: '',
    school,
    course,
    file: null,
    general: '',
  };

  const renderResourceTitleField = (
    <Field
      name="resourceTitle"
      label={t('forms:resourceTitle')}
      component={TextFormField}
      helperText={t('upload-resource:resourceTitleHelperText')}
    />
  );

  const renderResourceTypeField = (
    <Field
      name="resourceType"
      label={t('forms:resourceType')}
      dataKey="autocompleteResourceTypes"
      document={AutocompleteResourceTypesDocument}
      component={AutocompleteField}
      helperText={t('upload-resource:resourceTypeHelperText')}
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
      helperText={
        <>
          {t('upload-resource:schoolHelperText')}{' '}
          <TextLink href={urls.contact}>{t('upload-resource:schoolHelperLink')}</TextLink>
        </>
      }
    />
  );

  // Only collapse this field in once the school has been selected.
  const renderCourseField = (props: FormikProps<UploadResourceFormValues>) => (
    <Collapse in={!!props.values.school}>
      <Field
        name="course"
        label={t('forms:course')}
        dataKey="autocompleteCourses"
        searchKey="name"
        document={AutocompleteCoursesDocument}
        component={AutocompleteField}
        variables={{
          school: R.path(['values', 'school', 'id'], props), // Filter courses based on selected school.
        }}
        helperText={
          <>
            {t('upload-resource:courseHelperText')}{' '}
            <TextLink href={urls.createCourse}>{t('upload-resource:courseHelperLink')}</TextLink>
          </>
        }
      />
    </Collapse>
  );

  const renderFileField = <Field name="file" component={FileField} />;

  const renderFormSubmitSection = (props: FormikProps<UploadResourceFormValues>) => (
    <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
  );

  const renderFormFields = (props: FormikProps<UploadResourceFormValues>): JSX.Element => (
    <Form>
      {renderResourceTitleField}
      {renderResourceTypeField}
      {renderSchoolField}
      {renderCourseField(props)}
      {renderFileField}
      {renderFormSubmitSection(props)}
    </Form>
  );

  const renderForm = (
    <Formik
      onSubmit={handleUpload}
      initialValues={initialValues}
      validationSchema={validationSchema}
      innerRef={formRef}
      enableReinitialize
    >
      {renderFormFields}
    </Formik>
  );

  const layoutProps = {
    seoProps: {
      title: t('upload-resource:title'),
      description: t('upload-resource:description'),
    },
    header: t('upload-resource:header'),
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
    _ns: await loadNamespaces(['upload-resource'], locale),
  },
});

export default withAuth(UploadResourcePage);
