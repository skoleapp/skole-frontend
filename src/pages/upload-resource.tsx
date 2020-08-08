import {
    AutoCompleteField,
    DropzoneField,
    ErrorLayout,
    FormLayout,
    FormSubmitSection,
    LoadingLayout,
    OfflineLayout,
} from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import {
    CourseObjectType,
    CoursesDocument,
    CreateResourceMutation,
    ResourceTypesDocument,
    SchoolObjectType,
    SchoolsDocument,
    useCreateResourceInitialDataQuery,
    useCreateResourceMutation,
} from 'generated';
import { useForm } from 'hooks';
import { useTranslation, withAuth } from 'lib';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import Resizer from 'react-image-file-resizer';
import { AuthProps } from 'types';
import { redirect } from 'utils';
import * as Yup from 'yup';

interface UploadResourceFormValues {
    resourceTitle: string;
    resourceType: string;
    school: SchoolObjectType | null;
    course: CourseObjectType | null;
    file: File | null;
}

const UploadResourcePage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
    const { query } = useRouter();
    const { toggleNotification } = useNotificationsContext();
    const { t } = useTranslation();
    const { data, loading, error } = useCreateResourceInitialDataQuery({ variables: query });
    const school: SchoolObjectType = R.propOr(null, 'school', data);
    const course: CourseObjectType = R.propOr(null, 'course', data);

    const { ref, setSubmitting, onError, resetForm, handleMutationErrors, setFieldValue, unexpectedError } = useForm<
        UploadResourceFormValues
    >();

    const validationSchema = Yup.object().shape({
        resourceTitle: Yup.string().required(t('validation:required')),
        resourceType: Yup.object()
            .nullable()
            .required(t('validation:required')),
        school: Yup.object().nullable(),
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
                await redirect(`/resources/${createResource.resource.id}`);
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
                // File is an image, resize it first before sending to backend.
                Resizer.imageFileResizer(
                    file,
                    1400,
                    1400,
                    'JPEG',
                    90,
                    0,
                    (file: File) => {
                        handleUpload({ ...variables, file });
                    },
                    'blob',
                );
            } else {
                // File is not an image, can't do any processing so just send it as is.
                handleUpload(variables);
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

    const renderCardContent = (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema} ref={ref}>
            {(props): JSX.Element => (
                <Form>
                    <Field
                        name="resourceTitle"
                        label={t('forms:resourceTitle')}
                        placeholder={t('forms:resourceTitle')}
                        variant="outlined"
                        component={TextField}
                        fullWidth
                        autoComplete="off"
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
                        name="school"
                        label={t('forms:school')}
                        placeholder={t('forms:school')}
                        dataKey="schools"
                        document={SchoolsDocument}
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
                        variables={{ school: R.pathOr(undefined, ['values', 'school', 'id'], props) }} // Filter courses based on selected school.
                        fullWidth
                    />
                    <Field name="file" component={DropzoneField} />
                    <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
                </Form>
            )}
        </Formik>
    );

    const seoProps = {
        title: t('upload-resource:title'),
        description: t('upload-resource:description'),
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            header: t('upload-resource:header'),
            dynamicBackUrl: true,
        },
        desktopHeader: t('upload-resource:header'),
        renderCardContent,
    };

    if (loading || authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if ((!!error && !!error.networkError) || authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    } else if (!!error) {
        return <ErrorLayout seoProps={seoProps} />;
    }

    return <FormLayout {...layoutProps} />;
};

export default withAuth(UploadResourcePage);
