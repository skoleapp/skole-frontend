import { Box, Divider, FormControl, Typography } from '@material-ui/core';
import { HowToRegOutlined } from '@material-ui/icons';
import { AutoCompleteField, ButtonLink, FormLayout, FormSubmitSection, TextLink } from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import {
    RegisterMutation,
    SchoolObjectType,
    SchoolsDocument,
    SubjectObjectType,
    SubjectsDocument,
    useRegisterMutation,
    UserObjectType,
} from 'generated';
import { useForm, useLanguageSelector } from 'hooks';
import { includeDefaultNamespaces, withNoAuth, withUserAgent, withUserMe } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { I18nProps } from 'types';
import { redirect, urls } from 'utils';
import * as Yup from 'yup';

export interface RegisterFormValues {
    username: string;
    email: string;
    school: SchoolObjectType | null;
    subject: SubjectObjectType | null;
    password: string;
    confirmPassword: string;
    code: string;
}

const RegisterPage: NextPage<I18nProps> = () => {
    const { query } = useRouter();
    const { t } = useTranslation();
    const { renderLanguageButton } = useLanguageSelector();
    const { setUserMe } = useAuthContext();
    const { toggleNotification } = useNotificationsContext();

    const { ref, resetForm, setSubmitting, handleMutationErrors, onError, unexpectedError } = useForm<
        RegisterFormValues
    >();

    const validationSchema = Yup.object().shape({
        username: Yup.string().required(t('validation:required')),
        password: Yup.string()
            .min(8, t('validation:passwordTooShort'))
            .required(t('validation:required')),
        email: Yup.string()
            .email(t('validation:invalidEmail'))
            .required(t('validation:required')),
        school: Yup.object().nullable(),
        subject: Yup.object().nullable(),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], t('validation:passwordsNotMatch'))
            .required(t('validation:required')),
        code: Yup.string().required(t('validation:required')),
    });

    const initialValues = {
        username: '',
        email: '',
        school: null,
        subject: null,
        password: '',
        confirmPassword: '',
        code: R.propOr('', 'code', query) as string,
        general: '',
    };

    const onCompleted = async ({ register, login }: RegisterMutation): Promise<void> => {
        if (!!register && !!register.errors) {
            handleMutationErrors(register.errors);
        } else if (!!login && !!login.errors) {
            handleMutationErrors(login.errors);
        } else if (!!login && !!login.user && !!register && !!register.message) {
            try {
                resetForm();
                toggleNotification(register.message);
                setUserMe(login.user as UserObjectType);
                await redirect(urls.home);
            } catch {
                unexpectedError();
            }
        } else {
            unexpectedError();
        }
    };

    const [registerMutation] = useRegisterMutation({ onCompleted, onError });

    const handleSubmit = async (values: RegisterFormValues): Promise<void> => {
        const { username, email, school, subject, password, code } = values;

        await registerMutation({
            variables: {
                username,
                email,
                school: R.propOr('', 'id', school),
                subject: R.propOr('', 'id', subject),
                password,
                code,
            },
            context: { headers: { Authorization: '' } },
        });

        setSubmitting(false);
    };

    const renderCardContent = (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} ref={ref}>
            {(props): JSX.Element => (
                <Form>
                    <Field
                        placeholder={t('forms:username')}
                        label={t('forms:username')}
                        name="username"
                        component={TextField}
                        variant="outlined"
                        helperText={t('forms:usernameHelperText')}
                        fullWidth
                        autoComplete="off"
                    />
                    <Field
                        placeholder={t('forms:email')}
                        label={t('forms:email')}
                        name="email"
                        component={TextField}
                        variant="outlined"
                        helperText={t('forms:emailHelperText')}
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
                        helperText={t('forms:schoolHelpText')}
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
                        helperText={t('forms:subjectHelpText')}
                        fullWidth
                    />
                    <Field
                        placeholder={t('forms:password')}
                        label={t('forms:password')}
                        name="password"
                        component={TextField}
                        variant="outlined"
                        type="password"
                        fullWidth
                        autoComplete="off"
                    />
                    <Field
                        placeholder={t('forms:confirmPassword')}
                        label={t('forms:confirmPassword')}
                        name="confirmPassword"
                        type="password"
                        component={TextField}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                    />
                    <Field
                        placeholder={t('forms:betaCode')}
                        label={t('forms:betaCode')}
                        name="code"
                        component={TextField}
                        variant="outlined"
                        fullWidth
                        disabled={!!query.code}
                        autoComplete="off"
                    />
                    <FormControl fullWidth>
                        <Typography variant="body2" color="textSecondary">
                            {t('register:termsHelpText')}{' '}
                            <TextLink href={urls.terms} target="_blank">
                                {t('common:terms')}
                            </TextLink>
                            .
                        </Typography>
                    </FormControl>
                    <FormSubmitSection submitButtonText={t('common:register')} {...props} />
                    <Box marginY="1rem">
                        <Divider />
                    </Box>
                    <ButtonLink
                        href={urls.login}
                        variant="outlined"
                        color="primary"
                        endIcon={<HowToRegOutlined />}
                        fullWidth
                    >
                        {t('common:alreadyHaveAccount')}
                    </ButtonLink>
                </Form>
            )}
        </Formik>
    );

    const layoutProps = {
        seoProps: {
            title: t('register:title'),
            description: t('register:description'),
        },
        topNavbarProps: {
            header: t('register:header'),
            headerRight: renderLanguageButton,
        },
        desktopHeader: t('register:header'),
        renderCardContent,
    };

    return <FormLayout {...layoutProps} />;
};

const wrappers = R.compose(withUserAgent, withUserMe);

export const getServerSideProps: GetServerSideProps = wrappers(async () => ({
    props: { namespacesRequired: includeDefaultNamespaces(['register']) },
}));

export default withNoAuth(RegisterPage);
