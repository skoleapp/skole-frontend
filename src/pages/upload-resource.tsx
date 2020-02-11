import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import * as R from 'ramda';
import React from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';

import {
    CourseObjectType,
    CoursesDocument,
    ResourceTypesDocument,
    UploadResourceInitialDataDocument,
} from '../../generated/graphql';
import { UploadResourceMutation, useUploadResourceMutation } from '../../generated/graphql';
import { toggleNotification } from '../actions';
import { AutoCompleteField, DropzoneField, FormLayout, FormSubmitSection, StyledForm } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces, Router } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useForm, usePrivatePage } from '../utils';

interface UploadResourceFormValues {
    resourceTitle: string;
    resourceType: string;
    course: CourseObjectType | null;
    files: File[];
}

interface Props extends I18nProps {
    course?: CourseObjectType;
}

const UploadResourcePage: I18nPage<Props> = ({ course }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { ref, setSubmitting, onError, resetForm, handleMutationErrors } = useForm<UploadResourceFormValues>();

    const validationSchema = Yup.object().shape({
        resourceTitle: Yup.string().required(t('validation:resourceTitleRequired')),
        resourceType: Yup.object()
            .nullable()
            .required(t('validation:resourceTypeRequired')),
        course: Yup.object()
            .nullable()
            .required(t('validation:courseRequired')),
        files: Yup.array().required(t('validation:filesRequired')),
    });

    const onCompleted = async ({ uploadResource }: UploadResourceMutation): Promise<void> => {
        if (uploadResource) {
            if (uploadResource.errors) {
                handleMutationErrors(uploadResource.errors);
            } else if (uploadResource.resource && uploadResource.resource.id) {
                resetForm();
                dispatch(toggleNotification(t('notifications:resourceUploaded')));
                await Router.push(`/resources/${uploadResource.resource.id}`);
            }
        }
    };

    const [uploadResourceMutation] = useUploadResourceMutation({ onCompleted, onError });

    const handleSubmit = async (values: UploadResourceFormValues): Promise<void> => {
        const { resourceTitle, resourceType, course, files } = values;

        const variables = {
            resourceTitle,
            resourceType: R.propOr('', 'id', resourceType) as string,
            course: R.propOr('', 'id', course) as string,
            files: (files as unknown) as string,
        };

        await uploadResourceMutation({ variables });
        setSubmitting(false);
    };

    const initialValues = {
        resourceTitle: '',
        resourceType: '',
        course: course || null,
        files: [],
        general: '',
    };

    const renderCardContent = (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema} ref={ref}>
            {(props): JSX.Element => (
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
                    <Field name="files" label={t('upload-resource:dropzoneText')} component={DropzoneField} />
                    <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
                </StyledForm>
            )}
        </Formik>
    );

    return <FormLayout title={t('upload-resource:title')} backUrl renderCardContent={renderCardContent} />;
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
