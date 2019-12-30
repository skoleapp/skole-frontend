import * as Yup from 'yup';

import { CardHeader, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import {
    CreateCourseInitialDataDocument,
    CreateCourseMutation,
    SchoolType,
    SubjectType,
    useCreateCourseMutation,
} from '../../generated/graphql';
import { ErrorMessage, Field, Formik, FormikProps } from 'formik';
import { FormErrorMessage, FormSubmitSection, Layout, SlimCardContent, StyledCard, StyledForm } from '../components';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { Router, includeDefaultNamespaces } from '../i18n';
import { Select, TextField } from 'formik-material-ui';
import { useForm, usePrivatePage } from '../utils';
import { withApollo, withRedux } from '../lib';

import React from 'react';
import { compose } from 'redux';
import { openNotification } from '../actions';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

interface Props extends I18nProps {
    subjects?: SubjectType[];
    schools?: SchoolType[];
}

export interface CreateCourseFormValues {
    courseName: string;
    courseCode: string;
    subject: string;
    school: string;
    general: string;
}

const CreateCoursePage: I18nPage<Props> = ({ subjects, schools }) => {
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
        subject: '',
        school: '',
        general: '',
    };

    const renderForm = (props: FormikProps<CreateCourseFormValues>): JSX.Element => (
        <StyledForm>
            <Field
                name="courseName"
                placeholder={t('forms:courseName')}
                label={t('forms:courseName')}
                component={TextField}
                fullWidth
            />
            <Field
                name="courseCode"
                placeholder={t('forms:courseCode')}
                label={t('forms:courseCode')}
                component={TextField}
                fullWidth
            />
            <FormControl fullWidth>
                <InputLabel>{t('forms:subject')}</InputLabel>
                <Field name="subject" component={Select}>
                    <MenuItem value="">---</MenuItem>
                    {subjects &&
                        subjects.map((s: SubjectType, i: number) => (
                            <MenuItem key={i} value={s.id}>
                                {s.name}
                            </MenuItem>
                        ))}
                </Field>
                <ErrorMessage name="subject" component={FormErrorMessage} />
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>{t('forms:school')}</InputLabel>
                <Field name="school" component={Select}>
                    <MenuItem value="">---</MenuItem>
                    {schools &&
                        schools.map((s: SchoolType, i: number) => (
                            <MenuItem key={i} value={s.id}>
                                {s.name}
                            </MenuItem>
                        ))}
                </Field>
                <ErrorMessage name="school" component={FormErrorMessage} />
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

CreateCoursePage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
    await usePrivatePage(ctx);

    try {
        const { data } = await ctx.apolloClient.query({ query: CreateCourseInitialDataDocument });
        return { ...data, namespacesRequired: includeDefaultNamespaces(['create-course']) };
    } catch {
        return { namespacesRequired: includeDefaultNamespaces(['create-course']) };
    }
};

export default compose(withRedux, withApollo)(CreateCoursePage);
