import { Box, CardHeader, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { ErrorMessage, Field, Formik, FormikProps } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import { DropzoneArea } from 'material-ui-dropzone';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { UploadResourceInitialDataDocument } from '../../generated/graphql';
import { openNotification } from '../actions';
import {
  FormErrorMessage,
  FormSubmitSection,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm
} from '../components';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import {
  Course,
  I18nPage,
  I18nProps,
  ResourceType,
  SkoleContext,
  UploadResourceFormValues
} from '../types';
import { useForm, usePrivatePage } from '../utils';

interface Props extends I18nProps {
  resourceTypes?: ResourceType[];
  courses?: Course[];
}

const UploadResourcePage: I18nPage<Props> = ({ resourceTypes, courses }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { ref, setSubmitting, resetForm, setFieldValue } = useForm();
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    resourceTitle: Yup.string().required(t('validation:resourceTitleRequired')),
    resourceType: Yup.string().required(t('validation:resourceTypeRequired')),
    course: Yup.string().required(t('validation:courseRequired')),
    files: Yup.string().required(t('validation:filesRequired'))
  });

  const handleSubmit = async (values: UploadResourceFormValues) => {
    console.log(values);
    setSubmitting(false);
    resetForm();
    dispatch(openNotification(t('notifications:resourceUploaded')));
    await router.push('/');
  };

  const initialValues = {
    resourceTitle: '',
    resourceType: '',
    course: (router.query.courseId as string) || '',
    files: [],
    general: ''
  };

  const handleFileChange = (files: File[]) => setFieldValue('files', files);

  const renderForm = (props: FormikProps<UploadResourceFormValues>) => (
    <StyledForm>
      <Field
        name="resourceTitle"
        placeholder="Resource Title"
        label="Resource Title"
        component={TextField}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel>Resource Type</InputLabel>
        <Field name="resourceType" component={Select}>
          <MenuItem value="">---</MenuItem>
          {resourceTypes &&
            resourceTypes.map((r: ResourceType, i: number) => (
              <MenuItem key={i} value={r.id}>
                {r.name}
              </MenuItem>
            ))}
        </Field>
        <ErrorMessage name="resourceType" component={FormErrorMessage} />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Course</InputLabel>
        <Field name="course" component={Select}>
          <MenuItem value="">---</MenuItem>
          {courses &&
            courses.map((c: Course, i: number) => (
              <MenuItem key={i} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
        </Field>
        <ErrorMessage name="course" component={FormErrorMessage} />
      </FormControl>
      <FormControl fullWidth>
        <Box marginY="1rem">
          <DropzoneArea
            onChange={handleFileChange}
            acceptedFiles={['image/*']}
            filesLimit={20}
            dropzoneText={t('upload-resource:dropzoneText')}
            useChipsForPreview
            showAlerts={false}
          />
          <ErrorMessage name="files" component={FormErrorMessage} />
        </Box>
      </FormControl>
      <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
    </StyledForm>
  );

  return (
    <Layout title={t('upload-resource:title')} backUrl>
      <StyledCard>
        <CardHeader title={t('upload-resource:title')} />
        <SlimCardContent>
          <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
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

UploadResourcePage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await usePrivatePage(ctx);

  try {
    const { data } = await ctx.apolloClient.query({ query: UploadResourceInitialDataDocument });
    return {
      ...data,
      namespacesRequired: includeDefaultNamespaces(['upload-resource'])
    };
  } catch (err) {
    return {
      namespacesRequired: includeDefaultNamespaces(['upload-resource'])
    };
  }
};

export default compose(withApollo, withRedux)(UploadResourcePage);
