import * as R from 'ramda';
import * as Yup from 'yup';

import { AutoCompleteField, FormSubmitSection, Layout, StyledCard, StyledForm } from '../components';
import { CardContent, CardHeader, Grid } from '@material-ui/core';
import {
    CreateCourseMutation,
    SchoolType,
    SchoolsDocument,
    SubjectType,
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

interface CreateCourseFormValues {
    courseName: string;
    courseCode: string;
    subject: SubjectType | null;
    school: SchoolType | null;
    general: string;
}

const CreateCoursePage: I18nPage<I18nProps> = () => {
    const { ref, resetForm, setSubmitting, handleMutationErrors, onError } = useForm<CreateCourseFormValues>();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        courseName: Yup.string().required(t('validation:courseNameRequired')),
        courseCode: Yup.string(),
        subject: Yup.object()
            .nullable()
            .required(t('validation:subjectRequired')),
        school: Yup.object()
            .nullable()
            .required(t('validation:schoolRequired')),
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

    const renderForm = (props: FormikProps<CreateCourseFormValues>): JSX.Element => (
        <StyledForm>
            <Field
                name="courseName"
                label={t('forms:courseName')}
                placeholder={t('forms:courseName')}
                component={TextField}
                variant="outlined"
                fullWidth
            />
            <Field
                name="courseCode"
                label={t('forms:courseCode')}
                placeholder={t('forms:courseCode')}
                component={TextField}
                variant="outlined"
                fullWidth
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
        </StyledForm>
    );

    return (
        <Layout title={t('create-course:title')} backUrl>
            <StyledCard>
                <Grid container justify="center">
                    <Grid item xs={12} sm={8} md={6} lg={4}>
                        <CardHeader title={t('create-course:title')} />
                        <CardContent>
                            <Formik
                                initialValues={initialValues}
                                onSubmit={handleSubmit}
                                validationSchema={validationSchema}
                                ref={ref}
                            >
                                {renderForm}
                            </Formik>
                        </CardContent>
                    </Grid>
                </Grid>
            </StyledCard>
        </Layout>
    );
};

CreateCoursePage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePrivatePage(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['create-course']) };
};

export default compose(withRedux, withApollo)(CreateCoursePage);
