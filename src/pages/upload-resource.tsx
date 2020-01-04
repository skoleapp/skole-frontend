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
import {
    CourseType,
    CoursesDocument,
    ResourceTypesDocument,
    UploadResourceInitialDataDocument,
} from '../../generated/graphql';
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

interface UploadResourceFormValues {
    resourceTitle: string;
    resourceType: string;
    course: CourseType | null;
    files: File[];
}

interface Props extends I18nProps {
    course?: CourseType;
}

const UploadResourcePage: I18nPage<Props> = ({ course }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { ref, setSubmitting, resetForm, setFieldValue } = useForm<UploadResourceFormValues>();
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        resourceTitle: Yup.string().required(t('validation:resourceTitleRequired')),
        resourceType: Yup.string().required(t('validation:resourceTypeRequired')),
        course: Yup.object()
            .nullable()
            .required(t('validation:courseRequired')),
        files: Yup.array().required(t('validation:filesRequired')),
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
        course: course || null,
        files: [],
        general: '',
    };

    const handleFileChange = (files: File[]): void => setFieldValue('files', files);

    const renderForm = (props: FormikProps<UploadResourceFormValues>): JSX.Element => (
        <StyledForm>
            <FormControl fullWidth>
                <Field
                    name="resourceTitle"
                    label={t('forms:resourceTitle')}
                    placeholder={t('forms:resourceTitle')}
                    variant="outlined"
                    component={TextField}
                    fullWidth
                />
            </FormControl>
            <FormControl fullWidth>
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
            </FormControl>
            <FormControl fullWidth>
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
    const { query, apolloClient } = ctx;
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['upload-resource']) };

    if (!!query.course) {
        try {
            const { data } = await apolloClient.query({ query: UploadResourceInitialDataDocument, variables: query });
            return { ...data, ...nameSpaces };
        } catch {
            return nameSpaces;
        }
    } else {
        return nameSpaces;
    }
};

export default compose(withApollo, withRedux)(UploadResourcePage);
