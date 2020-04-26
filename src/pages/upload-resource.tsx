import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import Resizer from 'react-image-file-resizer';
import { useNotificationsContext } from 'src/context';
import { withApolloSSR, withAuthSync } from 'src/lib';
import * as Yup from 'yup';

import {
    CourseObjectType,
    CoursesDocument,
    CreateResourceInitialDataDocument,
    CreateResourceMutation,
    ResourceTypesDocument,
    useCreateResourceMutation,
} from '../../generated/graphql';
import { AutoCompleteField, DropzoneField, FormLayout, FormSubmitSection } from '../components';
import { env } from '../config';
import { Router, useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { I18nProps, SkolePageContext } from '../types';
import { useForm } from '../utils';

interface UploadResourceFormValues {
    resourceTitle: string;
    resourceType: string;
    course: CourseObjectType | null;
    file: File | null;
}

interface Props extends I18nProps {
    course?: CourseObjectType;
}

const UploadResourcePage: NextPage<Props> = ({ course }) => {
    const { toggleNotification } = useNotificationsContext();
    const { t } = useTranslation();

    const {
        ref,
        setSubmitting,
        onError,
        resetForm,
        handleMutationErrors,
        setFieldError,
        setFieldValue,
        unexpectedError,
    } = useForm<UploadResourceFormValues>();

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
        if (!!createResource) {
            if (!!createResource.errors) {
                handleMutationErrors(createResource.errors);
            } else if (!!createResource.resource && !!createResource.resource.id && !!createResource.message) {
                resetForm();
                toggleNotification(createResource.message);
                await Router.push(`/resources/${createResource.resource.id}`);
            } else {
                unexpectedError();
            }
        } else {
            unexpectedError();
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
        if (!!file) {
            const body = new FormData();
            body.append('file', file);
            setFieldValue('general', t('upload-resource:fileGenerationLoadingText'));

            try {
                const res = await fetch('https://api.cloudmersive.com/convert/autodetect/to/pdf', {
                    method: 'POST',
                    body,
                    headers: {
                        Apikey: env.CLOUDMERSIVE_API_KEY || '',
                    },
                });

                if (res.status === 200) {
                    const blob = await res.blob();
                    const pdf = new File([blob], 'resource.pdf');
                    handleUpload({ file: pdf, ...variables });
                } else {
                    handleFileGenerationError();
                }
            } catch {
                handleFileGenerationError();
            }
        }
    };

    const handleSubmit = async (variables: UploadResourceFormValues): Promise<void> => {
        const { file } = variables;

        if (!!file) {
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
                    (file: File) => {
                        generatePDFAndUpload({ ...variables, file });
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

    const layoutProps = {
        seoProps: {
            title: t('upload-resource:title'),
            description: t('upload-resource:description'),
        },
        topNavbarProps: {
            header: t('upload-resource:header'),
            dynamicBackUrl: true,
        },
        desktopHeader: t('upload-resource:header'),
        renderCardContent,
    };

    return <FormLayout {...layoutProps} />;
};

export const getServerSideProps: GetServerSideProps = withApolloSSR(async ctx => {
    const { query, apolloClient } = ctx as SkolePageContext;
    const namespaces = { namespacesRequired: includeDefaultNamespaces(['upload-resource']) };

    try {
        const { data } = await apolloClient.query({
            query: CreateResourceInitialDataDocument,
            variables: query,
        });

        return { props: { ...data, ...namespaces } };
    } catch {
        return { props: { ...namespaces } };
    }
});

export default withAuthSync(UploadResourcePage);
