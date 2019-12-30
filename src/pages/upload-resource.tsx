import * as R from 'ramda';
import * as Yup from 'yup';

import { Box, CardHeader, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { CourseType, ResourceTypeObjectType, UploadResourceInitialDataDocument } from '../../generated/graphql';
import { ErrorMessage, Field, Formik, FormikProps } from 'formik';
import { FormErrorMessage, FormSubmitSection, Layout, SlimCardContent, StyledCard, StyledForm } from '../components';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { Select, TextField } from 'formik-material-ui';
import { useForm, usePrivatePage } from '../utils';
import { withApollo, withRedux } from '../lib';

import { DropzoneArea } from 'material-ui-dropzone';
import React from 'react';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../i18n';
import { openNotification } from '../actions';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

interface Props extends I18nProps {
    resourceTypes?: ResourceTypeObjectType[];
    courses?: CourseType[];
}

export interface UploadResourceFormValues {
    resourceTitle: string;
    resourceType: string;
    course: string;
    files: File[];
}

const UploadResourcePage: I18nPage<Props> = ({ resourceTypes, courses }) => {
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
                        resourceTypes.map((r: ResourceTypeObjectType, i: number) => (
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
                        courses.map((c: CourseType, i: number) => (
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
            namespacesRequired: includeDefaultNamespaces(['upload-resource']),
        };
    } catch (err) {
        return {
            namespacesRequired: includeDefaultNamespaces(['upload-resource']),
        };
    }
};

export default compose(withApollo, withRedux)(UploadResourcePage);
