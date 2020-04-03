import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import * as R from 'ramda';
import React from 'react';
import Resizer from 'react-image-file-resizer';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';

import {
    CourseObjectType,
    CoursesDocument,
    CreateResourceInitialDataDocument,
    CreateResourceMutation,
    ResourceTypesDocument,
    useCreateResourceMutation,
} from '../../generated/graphql';
import { toggleNotification } from '../actions';
import { AutoCompleteField, DropzoneField, FormLayout, FormSubmitSection } from '../components';
import { Router, useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useForm, usePrivatePage } from '../utils';

interface UploadResourceFormValues {
    resourceTitle: string;
    resourceType: string;
    course: CourseObjectType | null;
    file: File | null;
}

interface Props extends I18nProps {
    course?: CourseObjectType;
}

const UploadResourcePage: I18nPage<Props> = ({ course }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { ref, setSubmitting, onError, resetForm, handleMutationErrors, setFieldError, setFieldValue } = useForm<
        UploadResourceFormValues
    >();

    const validationSchema = Yup.object().shape({
        resourceTitle: Yup.string().required(t('validation:required')),
        resourceType: Yup.object()
            .nullable()
            .required(t('validation:required')),
        course: Yup.object()
            .nullable()
            .required(t('validation:required')),
        file: Yup.mixed().required(t('validation:required')),
    });

    const onCompleted = async ({ createResource }: CreateResourceMutation): Promise<void> => {
        if (createResource) {
            if (createResource.errors) {
                handleMutationErrors(createResource.errors);
            } else if (createResource.resource && createResource.resource.id) {
                resetForm();
                dispatch(toggleNotification(t('notifications:resourceUploaded')));
                await Router.push(`/resources/${createResource.resource.id}`);
            }
        }
    };

    const [createResourceMutation] = useCreateResourceMutation({ onCompleted, onError });

    const handleUpload = async ({
        resourceTitle,
        resourceType,
        course,
        file,
    }: UploadResourceFormValues): Promise<void> => {
        const variables = {
            resourceTitle,
            resourceType: R.propOr('', 'id', resourceType) as string,
            course: R.propOr('', 'id', course) as string,
            file: (file as unknown) as string,
        };

        setFieldValue('general', t('upload-resource:fileUploadingText'));
        await createResourceMutation({ variables });
        setSubmitting(false);
    };

    const handleFileGenerationError = (): void => {
        setFieldError('file', t('upload-resource:fileGenerationError'));
        setFieldValue('general', '');
        setSubmitting(false);
    };

    // Use Cloudmersive API to generate PDF from any commonly used file format.
    const generatePDFAndUpload = async ({ file, ...variables }: UploadResourceFormValues): Promise<void> => {
        console.log('FILE_COMPRESSED: ', file);

        const body = new FormData();
        body.append('file', file);
        setFieldValue('general', t('upload-resource:fileGenerationLoadingText'));

        try {
            const res = await fetch('https://api.cloudmersive.com/convert/autodetect/to/pdf', {
                method: 'POST',
                body,
                headers: {
                    Apikey: process.env.CLOUDMERSIVE_API_KEY || '',
                },
            });

            if (res.status === 200) {
                const blob = await res.blob();
                const pdf = new File([blob], 'resource.pdf');
                handleUpload({ file: pdf, ...variables });
                console.log('FILE_FINAL: ', pdf);
            } else {
                handleFileGenerationError();
            }
        } catch {
            handleFileGenerationError();
        }
    };

    const handleSubmit = async (variables: UploadResourceFormValues): Promise<void> => {
        const { file } = variables;

        console.log('FILE_ORIGINAL: ', file);

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
            // File is image.
            Resizer.imageFileResizer(
                file,
                1400,
                1400,
                'JPEG',
                90,
                0,
                (uri: File) => {
                    const { file, ...rest } = { ...variables };
                    const newVariables = { file: uri, ...rest };

                    generatePDFAndUpload(newVariables);
                },
                'blob',
            );
        } else if (file.type !== 'application/pdf') {
            // File is neither image not PDF.
            generatePDFAndUpload(variables);
        } else {
            // File is PDF.
            handleUpload(variables);
        }
    };

    const initialValues = {
        resourceTitle: '',
        resourceType: '',
        course: course || null,
        file: null,
        general: '',
    };

    const renderCardContent = (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema} ref={ref}>
            {(props): JSX.Element => (
                <Form>
                    <Field
                        name="resourceTitle"
                        label={t('forms:resourceTitle')}
                        placeholder={t('forms:resourceTitle')}
                        variant="outlined"
                        autoComplete="off"
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
                    <Field name="file" component={DropzoneField} />
                    <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
                </Form>
            )}
        </Formik>
    );

    return (
        <FormLayout
            title={t('upload-resource:title')}
            heading={t('upload-resource:heading')}
            backUrl
            renderCardContent={renderCardContent}
        />
    );
};

UploadResourcePage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
    await usePrivatePage(ctx);
    const { query, apolloClient } = ctx;
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['upload-resource']) };

    if (!!query.course) {
        try {
            const { data } = await apolloClient.query({ query: CreateResourceInitialDataDocument, variables: query });
            return { ...data, ...nameSpaces };
        } catch {
            return nameSpaces;
        }
    } else {
        return nameSpaces;
    }
};
export default compose(withApollo, withRedux)(UploadResourcePage);
