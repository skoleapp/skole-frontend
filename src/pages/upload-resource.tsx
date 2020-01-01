import * as R from 'ramda';
import * as Yup from 'yup';

import {
    AutoCompleteField,
    FormErrorMessage,
    FormSubmitSection,
    Layout,
    SlimCardContent,
    StyledCard,
    StyledForm,
} from '../components';
import { Box, CardHeader, FormControl } from '@material-ui/core';
import { CoursesDocument, ResourceTypesDocument } from '../../generated/graphql';
import { ErrorMessage, Field, Formik, FormikProps } from 'formik';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useForm, usePrivatePage } from '../utils';
import { withApollo, withRedux } from '../lib';

import { DropzoneArea } from 'material-ui-dropzone';
import React from 'react';
import { TextField } from 'formik-material-ui';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../i18n';
import { openNotification } from '../actions';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

export interface UploadResourceFormValues {
    resourceTitle: string;
    resourceType: string;
    course: string;
    files: File[];
}

const UploadResourcePage: I18nPage<I18nProps> = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { ref, setSubmitting, resetForm, setFieldValue } = useForm<UploadResourceFormValues>();
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        resourceTitle: Yup.string().required(t('validation:resourceTitleRequired')),
        resourceType: Yup.string().required(t('validation:resourceTypeRequired')),
        course: Yup.string().required(t('validation:courseRequired')),
        files: Yup.string().required(t('validation:filesRequired')),
    });

    const handleSubmit = async (values: UploadResourceFormValues): Promise<void> => {
        console.log(values);
        setSubmitting(false);
        resetForm();
        dispatch(openNotification(t('notifications:resourceUploaded')));
        await router.push('/');
    };

    const initialValues = {
        resourceTitle: '',
        resourceType: '',
        course: R.propOr('', 'courseId', router.query) as string,
        files: [],
        general: '',
    };

    const handleFileChange = (files: File[]): void => setFieldValue('files', files);

    const renderForm = (props: FormikProps<UploadResourceFormValues>): JSX.Element => (
        <StyledForm>
            <Field
                name="resourceTitle"
                label={t('forms:resourceTitle')}
                placeholder={t('forms:resourceTitle')}
                variant="outlined"
                component={TextField}
                fullWidth
            />
            <Field
                name="resourceType"
                label={t('forms:resourceType')}
                placeholder={t('forms:resourceType')}
                dataKey="resourceTypes"
                document={ResourceTypesDocument}
                variant="outlined"
                component={AutoCompleteField}
                fullWidth
            />
            <Field
                name="course"
                label={t('forms:course')}
                placeholder={t('forms:course')}
                dataKey="courses"
                document={CoursesDocument}
                variant="outlined"
                component={AutoCompleteField}
                fullWidth
            />
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

UploadResourcePage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePrivatePage(ctx);

    return {
        namespacesRequired: includeDefaultNamespaces(['upload-resource']),
    };
};

export default compose(withApollo, withRedux)(UploadResourcePage);
