import { Box, Button, FormControl, InputAdornment, Typography } from '@material-ui/core';
import {
    AccountCircleOutlined,
    ArrowForwardOutlined,
    EmailOutlined,
    LockOutlined,
    VpnKeyOutlined,
} from '@material-ui/icons';
import {
    AutoCompleteField,
    ButtonLink,
    FormLayout,
    FormSubmitSection,
    LoadingLayout,
    OfflineLayout,
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
import { useTranslation, withNoAuth } from 'lib';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useState } from 'react';
import { AuthProps } from 'types';
import { urls } from 'utils';
import * as Yup from 'yup';

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
        if (!!register && !!register.errors) {
            handleRegisterMutationErrors(register.errors);
        } else if (!!login && !!login.errors) {
            handleRegisterMutationErrors(login.errors);
        } else if (!!login && !!register && !!register.user) {
            try {
                resetRegisterForm();
                setRegisteredUser(register.user);
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
        const { username, email, password, code } = values;

        await registerMutation({
            variables: {
                username,
                email,
                password,
                code,
            },
        });

        setRegisterFormSubmitting(false);
    };

    const onUpdateUserCompleted = ({ updateUser }: UpdateUserMutation): void => {
        if (!!updateUser) {
            if (!!updateUser.errors) {
                handleUpdateUserMutationErrors(updateUser.errors);
                resetUpdateUserForm();
                setPhase(RegisterPhases.REGISTER_COMPLETE);
            } else {
                updateUserUnexpectedError();
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
                title: R.propOr('', 'title', registeredUser),
                bio: R.propOr('', 'bio', registeredUser),
                avatar: R.propOr('', 'avatar', registeredUser),
                school: R.propOr('', 'id', school),
                subject: R.propOr('', 'id', subject),
            },
        });

        setUpdateUserFormSubmitting(false);
    };

    const renderUsernameField = (
        <Field
            placeholder={t('forms:username')}
            label={t('forms:username')}
            name="username"
            component={TextField}
            variant="outlined"
            helperText={t('forms:usernameHelperText')}
            fullWidth
            autoComplete="off"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <AccountCircleOutlined />
                    </InputAdornment>
                ),
            }}
        />
    );

    const renderEmailField = (
        <Field
            placeholder={t('forms:email')}
            label={t('forms:email')}
            name="email"
            component={TextField}
            variant="outlined"
            helperText={t('forms:emailHelperText')}
            fullWidth
            autoComplete="off" // FIXME: This seems to have no effect.
            type="email"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <EmailOutlined />
                    </InputAdornment>
                ),
            }}
        />
    );

    const renderPasswordField = (
        <Field
            placeholder={t('forms:password')}
            label={t('forms:password')}
            name="password"
            component={TextField}
            variant="outlined"
            type="password"
            fullWidth
            autoComplete="off"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <LockOutlined />
                    </InputAdornment>
                ),
            }}
        />
    );

    const renderConfirmPasswordField = (
        <Field
            placeholder={t('forms:confirmPassword')}
            label={t('forms:confirmPassword')}
            name="confirmPassword"
            type="password"
            component={TextField}
            variant="outlined"
            fullWidth
            autoComplete="off"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <LockOutlined />
                    </InputAdornment>
                ),
            }}
        />
    );

    const renderBetaCodeField = (
        <Field
            placeholder={t('forms:betaCode')}
            label={t('forms:betaCode')}
            name="code"
            component={TextField}
            variant="outlined"
            fullWidth
            disabled={!!query.code}
            autoComplete="off"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <VpnKeyOutlined />
                    </InputAdornment>
                ),
            }}
        />
    );

    const renderTermsLink = (
        <FormControl fullWidth>
            <Typography variant="body2" color="textSecondary">
                {t('register:termsHelpText')}{' '}
                <TextLink href={urls.terms} target="_blank">
                    {t('common:terms')}
                </TextLink>
                .
            </Typography>
        </FormControl>
    );

    const renderRegisterFormSubmitSection = (props: FormikProps<RegisterFormValues>): JSX.Element => (
        <FormSubmitSection submitButtonText={t('common:register')} {...props} />
    );

    const renderLoginButton = (
        <FormControl fullWidth>
            <ButtonLink href={urls.login} color="primary" fullWidth>
                {t('common:login')}
            </ButtonLink>
        </FormControl>
    );

    const renderRegisterFormContent = (props: FormikProps<RegisterFormValues>): JSX.Element => (
        <Form>
            {renderUsernameField}
            {renderEmailField}
            {renderPasswordField}
            {renderConfirmPasswordField}
            {renderBetaCodeField}
            {renderTermsLink}
            {renderRegisterFormSubmitSection(props)}
            {renderLoginButton}
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
        <FormControl fullWidth>
            <Box textAlign="left">
                <Typography variant="body2" color="textSecondary">
                    {t('register:registerCompleteHelpText')}
                </Typography>
            </Box>
        </FormControl>
    );

    const renderSchoolField = (
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
    );

    const renderSubjectField = (
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
    );

    const renderUpdateUserFormSubmitSection = (props: FormikProps<UpdateUserFormValues>): JSX.Element => (
        <FormSubmitSection submitButtonText={t('common:save')} {...props} />
    );

    const renderSkipButton = (
        <FormControl fullWidth>
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
        <FormControl fullWidth>
            <Typography variant="body2">
                {t('register:registerCompleteEmailSent', { email: R.propOr('-', 'email', registeredUser) })}
            </Typography>
            <Box marginTop="1rem">
                <ButtonLink
                    href={urls.home}
                    endIcon={<ArrowForwardOutlined />}
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    {t('common:continue')}
                </ButtonLink>
            </Box>
        </FormControl>
    );

    const renderCardContent = (
        <>
            {renderRegisterForm}
            {renderUpdateUserForm}
            {renderRegisterComplete}
        </>
    );

    const seoProps = {
        title: t('register:title'),
        description: t('register:description'),
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            header: getHeader(),
            headerRight: renderLanguageButton,
            disableAuthButtons: true,
        },
        desktopHeader: getHeader(),
        renderCardContent,
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if (authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    }

    return <FormLayout {...layoutProps} />;
};

export default withNoAuth(RegisterPage);
