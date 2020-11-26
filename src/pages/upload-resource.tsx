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
import Resizer from 'react-image-file-resizer';
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
  } = useForm();

  const validationSchema = Yup.object().shape({
    resourceTitle: Yup.string().required(t('validation:required')),
    resourceType: Yup.object().nullable().required(t('validation:required')),
    school: Yup.object().nullable(),
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

  const handleSubmit = async (variables: UploadResourceFormValues): Promise<void> => {
    const { file } = variables;

    if (file) {
      const imageTypes = [
        'image/apng',
        'image/bmp',
        'image/gif',
        'image/x-icon',
        'image/jpeg',
        'image/png',
        'image/svg+xml',
        'image/tiff',
        'image/webp	',
      ];

      if (imageTypes.includes(file.type)) {
        // File is an image, resize it first before sending to backend.
        Resizer.imageFileResizer(
          file,
          1400,
          1400,
          'JPEG',
          90,
          0,
          (file: File) => handleUpload({ ...variables, file }),
          'blob',
        );
      } else {
        // File is not an image, can't do any processing so just send it as is.
        await handleUpload(variables);
      }
    }
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
      disableSearch
    />
  );

  const renderSchoolField = (
    <Field
      name="school"
      label={t('forms:schoolOptional')}
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

  const renderCourseField = (props: FormikProps<UploadResourceFormValues>) => (
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
  );

  const renderFileField = <Field name="file" component={FileField} />;

  const renderFormSubmitSection = (props: FormikProps<UploadResourceFormValues>) => (
    <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
  );

  const renderformFields = (props: FormikProps<UploadResourceFormValues>): JSX.Element => (
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
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
      ref={formRef}
      enableReinitialize
    >
      {renderformFields}
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
