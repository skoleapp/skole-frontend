import {
    AutocompleteField,
    ErrorLayout,
    FormLayout,
    FormSubmitSection,
    LoadingLayout,
    OfflineLayout,
    TextFormField,
} from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik } from 'formik';
import {
    AutocompleteSchoolsDocument,
    AutocompleteSubjectsDocument,
    CreateCourseMutation,
    SchoolObjectType,
    SubjectObjectType,
    useCreateCourseAutocompleteDataQuery,
    useCreateCourseMutation,
} from 'generated';
import { useForm } from 'hooks';
import { useTranslation, withAuth } from 'lib';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { redirect } from 'utils';
import * as Yup from 'yup';

interface CreateCourseFormValues {
    courseName: string;
    courseCode: string;
    subjects: SubjectObjectType[];
    school: SchoolObjectType | null;
    general: string;
}

const CreateCoursePage: NextPage = () => {
    const { toggleNotification } = useNotificationsContext();
    const { t } = useTranslation();
    const { query } = useRouter();
    const { data, loading, error } = useCreateCourseAutocompleteDataQuery({ variables: query });
    const school: SchoolObjectType = R.propOr(null, 'school', data);
    const { formRef, resetForm, handleMutationErrors, onError, unexpectedError } = useForm<CreateCourseFormValues>();

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
            if (!!createCourse.errors && !!createCourse.errors.length) {
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

    const handleSubmit = async (values: CreateCourseFormValues): Promise<void> => {
        const { courseName, courseCode, school, subjects } = values;

        const variables = {
            courseName,
            courseCode,
            school: R.propOr('', 'id', school) as string,
            subjects: subjects.map(s => s.id),
        };

        await createCourseMutation({ variables });
    };

    const initialValues = {
        courseName: '',
        courseCode: '',
        school,
        subjects: [],
        general: '',
    };

    const renderForm = (
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema} ref={formRef}>
            {(props): JSX.Element => (
                <Form>
                    <Field name="courseName" label={t('forms:courseName')} component={TextFormField} />
                    <Field name="courseCode" label={t('forms:courseCode')} component={TextFormField} />
                    <Field
                        name="school"
                        label={t('forms:school')}
                        dataKey="autocompleteSchools"
                        searchKey="name"
                        document={AutocompleteSchoolsDocument}
                        component={AutocompleteField}
                    />
                    <Field
                        name="subjects"
                        label={t('forms:subjects')}
                        searchKey="name"
                        dataKey="autocompleteSubjects"
                        document={AutocompleteSubjectsDocument}
                        component={AutocompleteField}
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
        header: t('create-course:header'),
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

export default withAuth(CreateCoursePage);
