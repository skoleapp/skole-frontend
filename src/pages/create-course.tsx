import { AutoCompleteField, FormLayout, FormSubmitSection } from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import {
    CreateCourseMutation,
    SchoolsDocument,
    SchoolTypeObjectType,
    SubjectObjectType,
    SubjectsDocument,
    useCreateCourseMutation,
} from 'generated';
import { useForm } from 'hooks';
import { includeDefaultNamespaces, withAuth, withUserAgent, withUserMe } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { I18nProps } from 'types';
import { redirect } from 'utils';
import * as Yup from 'yup';

interface CreateCourseFormValues {
    courseName: string;
    courseCode: string;
    subjects: SubjectObjectType[];
    school: SchoolTypeObjectType | null;
    general: string;
}

const CreateCoursePage: NextPage<I18nProps> = () => {
    const { toggleNotification } = useNotificationsContext();
    const { t } = useTranslation();

    const { ref, resetForm, setSubmitting, handleMutationErrors, onError, unexpectedError } = useForm<
        CreateCourseFormValues
    >();

    const validationSchema = Yup.object().shape({
        courseName: Yup.string().required(t('validation:required')),
        courseCode: Yup.string(),
        subjects: Yup.mixed(),
        school: Yup.object()
            .nullable()
            .required(t('validation:required')),
    });

    const onCompleted = async ({ createCourse }: CreateCourseMutation): Promise<void> => {
        if (!!createCourse) {
            if (!!createCourse.errors) {
                handleMutationErrors(createCourse.errors);
            } else if (!!createCourse.course && !!createCourse.message) {
                resetForm();
                toggleNotification(createCourse.message);
                await redirect(`/courses/${createCourse.course.id}`);
            } else {
                unexpectedError();
            }
        } else {
            unexpectedError();
        }
    };

    const [createCourseMutation] = useCreateCourseMutation({ onCompleted, onError });

    const handleSubmit = (values: CreateCourseFormValues): void => {
        const { courseName, courseCode, school, subjects } = values;

        const variables = {
            courseName,
            courseCode,
            school: R.propOr('', 'id', school) as string,
            subjects: subjects.map(s => s.id),
        };

        createCourseMutation({ variables });
        setSubmitting(false);
    };

    const initialValues = {
        courseName: '',
        courseCode: '',
        school: null,
        subjects: [],
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
                        name="subjects"
                        label={t('forms:subjects')}
                        placeholder={t('forms:subjects')}
                        dataKey="subjects"
                        document={SubjectsDocument}
                        component={AutoCompleteField}
                        variant="outlined"
                        fullWidth
                        multiple
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

const wrappers = R.compose(withUserAgent, withUserMe);

export const getServerSideProps: GetServerSideProps = wrappers(async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['create-course']),
    },
}));

export default withAuth(CreateCoursePage);
