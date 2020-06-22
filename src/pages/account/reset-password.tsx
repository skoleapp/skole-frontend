import { Box, Typography } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotificationsContext } from 'src/context';
import { I18nProps } from 'src/types';
import * as Yup from 'yup';

import {
    ResetPasswordMutation,
    SendPasswordResetEmailMutation,
    useResetPasswordMutation,
    useSendPasswordResetEmailMutation,
} from '../../../generated/graphql';
import { FormSubmitSection, SettingsLayout } from '../../components';
import { includeDefaultNamespaces, Router } from '../../i18n';
import { useForm } from '../../utils';

const emailFormInitialValues = {
    email: '',
    general: '',
};

const passwordFormInitialValues = {
    newPassword: '',
    confirmNewPassword: '',
    general: '',
};

export interface EmailFormValues {
    email: string;
}

export interface PasswordFormValues {
    newPassword: string;
    confirmNewPassword: string;
}

const ResetPasswordPage: NextPage<I18nProps> = () => {
    const {
        ref: emailFormRef,
        handleMutationErrors: handleEmailFormMutationErrors,
        onError: onEmailFormError,
        setSubmitting: setSubmittingEmailForm,
        resetForm: resetEmailForm,
        unexpectedError: emailFormUnexpectedError,
    } = useForm<EmailFormValues>();

    const {
        ref: passwordFormRef,
        handleMutationErrors: handlePasswordFormMutationErrors,
        onError: onPasswordFormError,
        setSubmitting: setSubmittingPasswordForm,
        resetForm: resetPasswordForm,
        unexpectedError: passwordFormUnexpectedError,
    } = useForm<PasswordFormValues>();

    const { t } = useTranslation();
    const { query } = useRouter();
    const token = (query.token as string) || '';
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const { toggleNotification } = useNotificationsContext();

    const emailValidationSchema = Yup.object().shape({
        email: Yup.string()
            .email(t('validation:invalidEmail'))
            .required(t('validation:required')),
    });

    const passwordValidationSchema = Yup.object().shape({
        newPassword: Yup.string()
            .min(8, t('validation:passwordTooShort'))
            .required(t('validation:required')),
        confirmNewPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], t('validation:passwordsNotMatch'))
            .required(t('validation:required')),
    });

    const onEmailFormCompleted = ({ sendPasswordResetEmail }: SendPasswordResetEmailMutation): void => {
        if (!!sendPasswordResetEmail) {
            if (sendPasswordResetEmail.errors) {
                handleEmailFormMutationErrors(sendPasswordResetEmail.errors);
            } else if (sendPasswordResetEmail.message) {
                resetEmailForm();
                toggleNotification(sendPasswordResetEmail.message);
                setEmailSubmitted(true);
            } else {
                emailFormUnexpectedError();
            }
        }
    };

    const onPasswordFormCompleted = ({ resetPassword }: ResetPasswordMutation): void => {
        if (!!resetPassword) {
            if (!!resetPassword.errors) {
                handlePasswordFormMutationErrors(resetPassword.errors);
            } else if (!!resetPassword.message) {
                resetPasswordForm();
                toggleNotification(resetPassword.message);
                Router.push('/login');
            } else {
                passwordFormUnexpectedError();
            }
        }
    };

    const [sendPasswordResetEmail] = useSendPasswordResetEmailMutation({
        onCompleted: onEmailFormCompleted,
        onError: onEmailFormError,
    });

    const [resetPassword] = useResetPasswordMutation({
        onCompleted: onPasswordFormCompleted,
        onError: onPasswordFormError,
    });

    const handleSubmitEmail = async (values: EmailFormValues): Promise<void> => {
        const { email } = values;
        await sendPasswordResetEmail({ variables: { email } });
        setSubmittingEmailForm(false);
    };

    const handleSubmitPassword = async (values: PasswordFormValues): Promise<void> => {
        const { newPassword } = values;
        await resetPassword({ variables: { newPassword, token } });
        setSubmittingPasswordForm(false);
    };

    const renderEmailForm = (
        <Formik
            initialValues={emailFormInitialValues}
            validationSchema={emailValidationSchema}
            onSubmit={handleSubmitEmail}
            ref={emailFormRef}
        >
            {(props): JSX.Element => (
                <Form>
                    <Field
                        placeholder={t('forms:email')}
                        name="email"
                        component={TextField}
                        label={t('forms:email')}
                        variant="outlined"
                        helperText={t('reset-password:helpText')}
                        fullWidth
                        autoComplete="off"
                    />
                    <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
                </Form>
            )}
        </Formik>
    );

    const renderEmailSubmitted = (
        <Box flexGrow="1" textAlign="center">
            <Typography variant="body2">{t('reset-password:emailSubmitted')}</Typography>
        </Box>
    );

    const renderPasswordForm = (
        <Formik
            initialValues={passwordFormInitialValues}
            validationSchema={passwordValidationSchema}
            onSubmit={handleSubmitPassword}
            ref={passwordFormRef}
        >
            {(props): JSX.Element => (
                <Form>
                    <Field
                        placeholder={t('forms:newPassword')}
                        name="newPassword"
                        component={TextField}
                        label={t('forms:newPassword')}
                        variant="outlined"
                        type="password"
                        fullWidth
                        autoComplete="off"
                    />
                    <Field
                        placeholder={t('forms:confirmNewPassword')}
                        name="confirmNewPassword"
                        component={TextField}
                        label={t('forms:confirmNewPassword')}
                        variant="outlined"
                        type="password"
                        fullWidth
                        autoComplete="off"
                    />
                    <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
                </Form>
            )}
        </Formik>
    );

    const renderCardContent = !!token ? renderPasswordForm : emailSubmitted ? renderEmailSubmitted : renderEmailForm;

    const layoutProps = {
        seoProps: {
            title: t('reset-password:title'),
            description: t('reset-password:description'),
        },
        topNavbarProps: {
            header: t('reset-password:header'),
            dynamicBackUrl: true,
        },
        renderCardContent,
        desktopHeader: t('reset-password:header'),
        formLayout: true,
    };

    return <SettingsLayout {...layoutProps} />;
};

export const getServerSideProps: GetServerSideProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['reset-password']),
    },
});

export default ResetPasswordPage;
