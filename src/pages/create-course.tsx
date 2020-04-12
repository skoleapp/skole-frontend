import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';
import * as Yup from 'yup';

import {
    CreateCourseMutation,
    SchoolsDocument,
    SchoolTypeObjectType,
    SubjectObjectType,
    SubjectsDocument,
    useCreateCourseMutation,
} from '../../generated/graphql';
import { AutoCompleteField, FormLayout, FormSubmitSection } from '../components';
import { useSkoleContext } from '../context';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces, Router } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps } from '../types';
import { useForm, withAuthSync } from '../utils';

interface CreateCourseFormValues {
    courseName: string;
    courseCode: string;
    subject: SubjectObjectType | null;
    school: SchoolTypeObjectType | null;
    general: string;
}

const CreateCoursePage: I18nPage<I18nProps> = () => {
    const { ref, resetForm, setSubmitting, handleMutationErrors, onError } = useForm<CreateCourseFormValues>();
    const { toggleNotification } = useSkoleContext();
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        courseName: Yup.string().required(t('validation:required')),
        courseCode: Yup.string(),
        subject: Yup.object().nullable(),
        school: Yup.object()
            .nullable()
            .required(t('validation:required')),
    });

    const onCompleted = async ({ createCourse }: CreateCourseMutation): Promise<void> => {
        if (createCourse) {
            if (createCourse.errors) {
                handleMutationErrors(createCourse.errors);
            } else if (createCourse.course) {
                resetForm();
                toggleNotification(t('notifications:courseCreated'));
                await Router.push(`/courses/${createCourse.course.id}`);
            }
        }
    };

    const [createCourseMutation] = useCreateCourseMutation({ onCompleted, onError });

    const handleSubmit = (values: CreateCourseFormValues): void => {
        const { courseName, courseCode, school, subject } = values;

        const variables = {
            courseName,
            courseCode,
            school: R.propOr('', 'id', school) as string,
            subject: R.propOr('', 'id', subject) as string,
        };

        createCourseMutation({ variables });
        setSubmitting(false);
    };

    const initialValues = {
        courseName: '',
        courseCode: '',
        school: null,
        subject: null,
        general: '',
    };

    const renderCardContent = (
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema} ref={ref}>
            {(props): JSX.Element => (
                <Form>
                    <Field
                        name="courseName"
                        label={t('forms:courseName')}
                        placeholder={t('forms:courseName')}
                        component={TextField}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                    />
                    <Field
                        name="courseCode"
                        label={t('forms:courseCode')}
                        placeholder={t('forms:courseCode')}
                        component={TextField}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                    />
                    <Field
                        name="school"
                        label={t('forms:school')}
                        placeholder={t('forms:school')}
                        dataKey="schools"
                        document={SchoolsDocument}
                        component={AutoCompleteField}
                        variant="outlined"
                        fullWidth
                    />
                    <Field
                        name="subject"
                        label={t('forms:subject')}
                        placeholder={t('forms:subject')}
                        dataKey="subjects"
                        document={SubjectsDocument}
                        component={AutoCompleteField}
                        variant="outlined"
                        fullWidth
                    />
                    <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
                </Form>
            )}
        </Formik>
    );

    const layoutProps = {
        seoProps: {
            title: t('create-course:title'),
            description: t('create-course:description'),
        },
        topNavbarProps: {
            header: t('create-course:header'),
            dynamicBackUrl: true,
        },
        desktopHeader: t('create-course:header'),
        renderCardContent,
    };

    return <FormLayout {...layoutProps} />;
};

CreateCoursePage.getInitialProps = async (): Promise<I18nProps> => ({
    namespacesRequired: includeDefaultNamespaces(['create-course']),
});

export default compose(withAuthSync, withRedux, withApollo)(CreateCoursePage);
