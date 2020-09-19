import { Button, FormControl, FormHelperText, makeStyles, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import {
    AutoCompleteField,
    ButtonLink,
    FormLayout,
    FormSubmitSection,
    LoadingLayout,
    OfflineLayout,
    PasswordField,
    TextLink,
} from 'components';
import { Field, Form, Formik, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import {
    RegisterMutation,
    SchoolObjectType,
    SchoolsDocument,
    SubjectObjectType,
    SubjectsDocument,
    UpdateUserMutation,
    useRegisterMutation,
    UserObjectType,
    useUpdateUserMutation,
} from 'generated';
import { useForm, useLanguageSelector } from 'hooks';
import { includeDefaultNamespaces, useTranslation, withNoAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useState } from 'react';
import { AuthProps } from 'types';
import { urls } from 'utils';
import * as Yup from 'yup';

const useStyles = makeStyles({
    link: {
        textAlign: 'center',
    },
});

interface RegisterFormValues {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    code: string;
}

interface UpdateUserFormValues {
    school: SchoolObjectType | null;
    subject: SubjectObjectType | null;
}

enum RegisterPhases {
    REGISTER = 'register',
    UPDATE_USER = 'update-user',
    REGISTER_COMPLETE = 'register-complete',
}

const RegisterPage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
    const classes = useStyles();
    const { query } = useRouter();
    const { t } = useTranslation();
    const { renderLanguageButton } = useLanguageSelector();
    const [registeredUser, setRegisteredUser] = useState<Pick<UserObjectType, 'username' | 'email'> | null>(null);
    const [phase, setPhase] = useState(RegisterPhases.REGISTER);
    const handleSkipUpdateProfile = (): void => setPhase(RegisterPhases.REGISTER_COMPLETE);

    const {
        ref: registerFormRef,
        resetForm: resetRegisterForm,
        setSubmitting: setRegisterFormSubmitting,
        handleMutationErrors: handleRegisterMutationErrors,
        onError: onRegisterError,
        unexpectedError: unexpectedRegisterError,
    } = useForm<RegisterFormValues>();

    const {
        ref: updateUserFormRef,
        resetForm: resetUpdateUserForm,
        setSubmitting: setUpdateUserFormSubmitting,
        handleMutationErrors: handleUpdateUserMutationErrors,
        onError: onUpdateUserError,
        unexpectedError: updateUserUnexpectedError,
    } = useForm<UpdateUserFormValues>();

    const getHeader = (): string => {
        switch (phase) {
            case RegisterPhases.REGISTER: {
                return t('register:header');
            }

            case RegisterPhases.UPDATE_USER: {
                return t('register:updateUserHeader');
            }

            case RegisterPhases.REGISTER_COMPLETE: {
                return t('register:registerCompleteHeader');
            }
        }
    };

    const registerInitialValues = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        code: R.propOr('', 'code', query) as string,
        general: '',
    };

    const registerValidationSchema = Yup.object().shape({
        username: Yup.string().required(t('validation:required')),
        password: Yup.string()
            .min(8, t('validation:passwordTooShort'))
            .required(t('validation:required')),
        email: Yup.string()
            .email(t('validation:invalidEmail'))
            .required(t('validation:required')),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], t('validation:passwordsNotMatch'))
            .required(t('validation:required')),
        code: Yup.string().required(t('validation:required')),
    });

    const updateUserInitialValues = {
        school: null,
        subject: null,
        general: '',
    };

    const updateUserValidationSchema = Yup.object().shape({
        school: Yup.object().nullable(),
        subject: Yup.object().nullable(),
    });

    const onRegisterCompleted = async ({ register, login }: RegisterMutation): Promise<void> => {
        if (!!register && !!register.errors && !!register.errors.length) {
            handleRegisterMutationErrors(register.errors);
        } else if (!!login && !!login.errors && !!login.errors.length) {
            handleRegisterMutationErrors(login.errors);
        } else if (!!login && !!login.user && !!register) {
            try {
                resetRegisterForm();
                setRegisteredUser(login.user);
                setPhase(RegisterPhases.UPDATE_USER);
            } catch {
                unexpectedRegisterError();
            }
        } else {
            unexpectedRegisterError();
        }
    };

    const [registerMutation] = useRegisterMutation({ onCompleted: onRegisterCompleted, onError: onRegisterError });

    const handleRegisterSubmit = async (values: RegisterFormValues): Promise<void> => {
        const { username, email, password } = values;

        await registerMutation({
            variables: {
                username,
                email,
                password,
            },
        });

        setRegisterFormSubmitting(false);
    };

    const onUpdateUserCompleted = ({ updateUser }: UpdateUserMutation): void => {
        if (!!updateUser) {
            if (!!updateUser.errors) {
                handleUpdateUserMutationErrors(updateUser.errors);
            } else {
                resetUpdateUserForm();
                setPhase(RegisterPhases.REGISTER_COMPLETE);
            }
        } else {
            updateUserUnexpectedError();
        }
    };

    const [updateUserMutation] = useUpdateUserMutation({
        onCompleted: onUpdateUserCompleted,
        onError: onUpdateUserError,
    });

    const handleRegisterCompleteSubmit = async ({ school, subject }: UpdateUserFormValues): Promise<void> => {
        await updateUserMutation({
            variables: {
                username: R.propOr('', 'username', registeredUser),
                email: R.propOr('', 'email', registeredUser),
                title: '',
                bio: '',
                avatar: "R.propOr('', 'avatar', registeredUser)",
                school: R.propOr('', 'id', school),
                subject: R.propOr('', 'id', subject),
            },
        });

        setUpdateUserFormSubmitting(false);
    };

    const renderUsernameField = (
        <Field
            label={t('forms:username')}
            name="username"
            component={TextField}
            helperText={t('forms:usernameHelperText')}
        />
    );

    const renderEmailField = (
        <Field label={t('forms:email')} name="email" component={TextField} helperText={t('forms:emailHelperText')} />
    );

    const renderPasswordField = (props: FormikProps<RegisterFormValues>): JSX.Element => <PasswordField {...props} />;

    const renderConfirmPasswordField = (props: FormikProps<RegisterFormValues>): JSX.Element => (
        <PasswordField label={t('forms:confirmPassword')} name="confirmPassword" {...props} />
    );

    const renderTermsLink = (
        <FormControl>
            <FormHelperText>
                {t('register:termsHelpText')}{' '}
                <TextLink href={urls.terms} target="_blank">
                    {t('common:terms')}
                </TextLink>
                .
            </FormHelperText>
        </FormControl>
    );

    const renderRegisterFormSubmitSection = (props: FormikProps<RegisterFormValues>): JSX.Element => (
        <FormSubmitSection submitButtonText={t('common:register')} {...props} />
    );

    const renderLoginLink = (
        <FormControl className={classes.link}>
            <TextLink href={urls.login}>{t('common:login')}</TextLink>
        </FormControl>
    );

    const renderRegisterFormContent = (props: FormikProps<RegisterFormValues>): JSX.Element => (
        <Form>
            {renderUsernameField}
            {renderEmailField}
            {renderPasswordField(props)}
            {renderConfirmPasswordField(props)}
            {renderConfirmPasswordField}
            {renderTermsLink}
            {renderRegisterFormSubmitSection(props)}
            {renderLoginLink}
        </Form>
    );

    const renderRegisterForm = phase === RegisterPhases.REGISTER && (
        <Formik
            initialValues={registerInitialValues}
            validationSchema={registerValidationSchema}
            onSubmit={handleRegisterSubmit}
            ref={registerFormRef}
        >
            {renderRegisterFormContent}
        </Formik>
    );

    const renderRegisterCompleteHelpText = (
        <FormControl>
            <FormHelperText>{t('register:registerCompleteHelpText')}</FormHelperText>
        </FormControl>
    );

    const renderSchoolField = (
        <Field
            name="school"
            label={t('forms:schoolOptional')}
            dataKey="schools"
            document={SchoolsDocument}
            component={AutoCompleteField}
        />
    );

    const renderSubjectField = (
        <Field
            name="subject"
            label={t('forms:subjectOptional')}
            dataKey="subjects"
            document={SubjectsDocument}
            component={AutoCompleteField}
        />
    );

    const renderUpdateUserFormSubmitSection = (props: FormikProps<UpdateUserFormValues>): JSX.Element => (
        <FormSubmitSection submitButtonText={t('common:save')} {...props} />
    );

    const renderSkipButton = (
        <FormControl>
            <Button onClick={handleSkipUpdateProfile} color="primary" fullWidth>
                {t('common:skip')}
            </Button>
        </FormControl>
    );

    const renderUpdateUserFormContent = (props: FormikProps<UpdateUserFormValues>): JSX.Element => (
        <Form>
            {renderRegisterCompleteHelpText}
            {renderSchoolField}
            {renderSubjectField}
            {renderUpdateUserFormSubmitSection(props)}
            {renderSkipButton}
        </Form>
    );

    const renderUpdateUserForm = phase === RegisterPhases.UPDATE_USER && (
        <Formik
            initialValues={updateUserInitialValues}
            validationSchema={updateUserValidationSchema}
            onSubmit={handleRegisterCompleteSubmit}
            ref={updateUserFormRef}
        >
            {renderUpdateUserFormContent}
        </Formik>
    );

    const renderRegisterComplete = phase === RegisterPhases.REGISTER_COMPLETE && (
        <FormControl>
            <Typography variant="subtitle1" align="center">
                {t('register:registerCompleteEmailSent')}
            </Typography>
            <Typography component="br" />
            <ButtonLink
                href={urls.home}
                endIcon={<ArrowForwardOutlined />}
                color="primary"
                variant="contained"
                fullWidth
            >
                {t('common:continue')}
            </ButtonLink>
        </FormControl>
    );

    const seoProps = {
        title: t('register:title'),
        description: t('register:description'),
    };

    const layoutProps = {
        seoProps,
        header: getHeader(),
        disableBottomNavbar: true,
        topNavbarProps: {
            headerRight: renderLanguageButton,
            disableAuthButtons: true,
            disableSearch: true,
        },
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if (authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    }

    return (
        <FormLayout {...layoutProps}>
            {renderRegisterForm}
            {renderUpdateUserForm}
            {renderRegisterComplete}
        </FormLayout>
    );
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['register']),
    },
});

export default withNoAuth(RegisterPage);
