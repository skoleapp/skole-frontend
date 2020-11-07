import {
    AutocompleteField,
    ErrorLayout,
    FileField,
    FormLayout,
    FormSubmitSection,
    LoadingLayout,
    OfflineLayout,
    TextFormField,
    TextLink,
} from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik } from 'formik';
import {
    AutocompleteCoursesDocument,
    AutocompleteResourceTypesDocument,
    AutocompleteSchoolsDocument,
    CourseObjectType,
    CreateResourceAutocompleteDataQueryVariables,
    CreateResourceMutation,
    SchoolObjectType,
    useCreateResourceAutocompleteDataQuery,
    useCreateResourceMutation,
} from 'generated';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation, withAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Router from 'next/router';
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
    const variables: CreateResourceAutocompleteDataQueryVariables = R.pick(['school', 'course'], query);
    const context = useLanguageHeaderContext();
    const { data, loading, error } = useCreateResourceAutocompleteDataQuery({ variables, context });
    const school: SchoolObjectType = R.propOr(null, 'school', data);
    const course: CourseObjectType = R.propOr(null, 'course', data);

    const { formRef, onError, resetForm, handleMutationErrors, setFieldValue, unexpectedError } = useForm<
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
            if (!!createResource.errors && !!createResource.errors.length) {
                handleMutationErrors(createResource.errors);
            } else if (!!createResource.resource && !!createResource.resource.id && !!createResource.successMessage) {
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

    const [createResource] = useCreateResourceMutation({ onCompleted, onError, context });

    const handleUpload = async ({
        resourceTitle,
        resourceType: _resourceType,
        course: _course,
        file: _file,
    }: UploadResourceFormValues): Promise<void> => {
        const resourceType: string = R.propOr('', 'id', _resourceType);
        const course: string = R.propOr('', 'id', _course);
        const file = String(_file);

        const variables = {
            resourceTitle,
            resourceType,
            course,
            file,
        };

        setFieldValue('general', t('upload-resource:fileUploadingText'));
        await createResource({ variables });
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

    const renderForm = (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema} ref={formRef}>
            {(props): JSX.Element => (
                <Form>
                    <Field
                        name="resourceTitle"
                        label={t('forms:resourceTitle')}
                        component={TextFormField}
                        helperText={t('upload-resource:resourceTitleHelperText')}
                    />
                    <Field
                        name="resourceType"
                        label={t('forms:resourceType')}
                        dataKey="autocompleteResourceTypes"
                        document={AutocompleteResourceTypesDocument}
                        component={AutocompleteField}
                        disableSearch
                    />
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
                                <TextLink href={urls.createCourse}>{t('upload-resource:schoolHelperLink')}</TextLink>
                            </>
                        }
                    />
                    <Field
                        name="course"
                        label={t('forms:course')}
                        dataKey="autocompleteCourses"
                        searchKey="name"
                        document={AutocompleteCoursesDocument}
                        component={AutocompleteField}
                        variables={{ school: R.pathOr(undefined, ['values', 'school', 'id'], props) }} // Filter courses based on selected school.
                        helperText={
                            <>
                                {t('upload-resource:courseHelperText')}{' '}
                                <TextLink href={urls.createCourse}>{t('upload-resource:courseHelperLink')}</TextLink>
                            </>
                        }
                    />
                    <Field name="file" component={FileField} />
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
        header: t('upload-resource:header'),
        topNavbarProps: {
            dynamicBackUrl: true,
        },
    };

    if (loading) {
        return <LoadingLayout />;
    }

    if (!!error && !!error.networkError) {
        return <OfflineLayout />;
    } else if (!!error) {
        return <ErrorLayout />;
    }

    return <FormLayout {...layoutProps}>{renderForm}</FormLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        _ns: await loadNamespaces(['upload-resource'], locale),
    },
});

export default withAuth(UploadResourcePage);
