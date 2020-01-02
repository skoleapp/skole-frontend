import * as Yup from 'yup';

import { AutoCompleteField, FormSubmitSection, Layout, SlimCardContent, StyledCard, StyledForm } from '../components';
import { CardHeader, FormControl } from '@material-ui/core';
import {
    CreateCourseMutation,
    SchoolsDocument,
    SubjectsDocument,
    useCreateCourseMutation,
} from '../../generated/graphql';
import { Field, Formik, FormikProps } from 'formik';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { Router, includeDefaultNamespaces } from '../i18n';
import { useForm, usePrivatePage } from '../utils';
import { withApollo, withRedux } from '../lib';

import React from 'react';
import { TextField } from 'formik-material-ui';
import { compose } from 'redux';
import { openNotification } from '../actions';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

export interface CreateCourseFormValues {
    courseName: string;
    courseCode: string;
    subject: string;
    school: string;
    general: string;
}

const CreateCoursePage: I18nPage<I18nProps> = () => {
    const { ref, resetForm, setSubmitting, handleMutationErrors, onError } = useForm<CreateCourseFormValues>();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        courseName: Yup.string().required(t('validation:courseNameRequired')),
        courseCode: Yup.string(),
        subject: Yup.string().required(t('validation:subjectRequired')),
        school: Yup.string().required(t('validation:schoolRequired')),
    });

    const onCompleted = async ({ createCourse }: CreateCourseMutation): Promise<void> => {
        if (createCourse) {
            if (createCourse.errors) {
                handleMutationErrors(createCourse.errors);
            } else if (createCourse.course) {
                resetForm();
                dispatch(openNotification(t('notifications:courseCreated')));
                await Router.push(`/courses/${createCourse.course.id}`);
            }
        }
    };

    const [createCourseMutation] = useCreateCourseMutation({ onCompleted, onError });

    const handleSubmit = (values: CreateCourseFormValues): void => {
        const { courseName, courseCode, school, subject } = values;
        createCourseMutation({ variables: { courseName, courseCode, school, subject } });
        setSubmitting(false);
    };

    const initialValues = {
        courseName: '',
        courseCode: '',
        school: '',
        subject: '',
        general: '',
    };

    const renderForm = (props: FormikProps<CreateCourseFormValues>): JSX.Element => (
        <StyledForm>
            <FormControl fullWidth>
                <Field
                    name="courseName"
                    label={t('forms:courseName')}
                    placeholder={t('forms:courseName')}
                    component={TextField}
                    variant="outlined"
                    fullWidth
                />
            </FormControl>
            <FormControl fullWidth>
                <Field
                    name="courseCode"
                    label={t('forms:courseCode')}
                    placeholder={t('forms:courseCode')}
                    component={TextField}
                    variant="outlined"
                    fullWidth
                />
            </FormControl>
            <FormControl fullWidth>
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
            </FormControl>
            <FormControl fullWidth>
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
            </FormControl>
            <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
        </StyledForm>
    );

    return (
        <Layout title={t('create-course:title')} backUrl>
            <StyledCard>
                <CardHeader title={t('create-course:title')} />
                <SlimCardContent>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
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

CreateCoursePage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePrivatePage(ctx);

    return {
        namespacesRequired: includeDefaultNamespaces(['create-course']),
    };
};

export default compose(withRedux, withApollo)(CreateCoursePage);
