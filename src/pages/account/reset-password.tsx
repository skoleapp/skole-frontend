import { Box, Typography } from '@material-ui/core';
import { FormSubmitSection, LoadingLayout, OfflineLayout, SettingsLayout } from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import {
    ResetPasswordMutation,
    SendPasswordResetEmailMutation,
    useResetPasswordMutation,
    useSendPasswordResetEmailMutation,
} from 'generated';
import { useForm } from 'hooks';
import { includeDefaultNamespaces, useTranslation, withNoAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { AuthProps } from 'types';
import { redirect, urls } from 'utils';
import * as Yup from 'yup';

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

const ResetPasswordPage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
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
    const header = !emailSubmitted ? t('reset-password:header') : t('reset-password:emailSubmittedHeader');

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
                redirect(urls.logout);
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

    const renderEmailFormContent = (props: FormikProps<EmailFormValues>): JSX.Element => (
        <Form>
            <Field
                placeholder={t('forms:email')}
                name="email"
                component={TextField}
                label={t('forms:email')}
                helperText={t('reset-password:helpText')}
            />
            <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
        </Form>
    );

    const renderEmailForm = (
        <Formik
            initialValues={emailFormInitialValues}
            validationSchema={emailValidationSchema}
            onSubmit={handleSubmitEmail}
            ref={emailFormRef}
        >
            {renderEmailFormContent}
        </Formik>
    );

    const renderEmailSubmitted = (
        <Box flexGrow="1" textAlign="center">
            <Typography variant="body2">{t('reset-password:emailSubmitted')}</Typography>
        </Box>
    );

    const renderPasswordFormContent = (props: FormikProps<PasswordFormValues>): JSX.Element => (
        <Form>
            <Field
                placeholder={t('forms:newPassword')}
                name="newPassword"
                component={TextField}
                label={t('forms:newPassword')}
                type="password"
            />
            <Field
                placeholder={t('forms:confirmNewPassword')}
                name="confirmNewPassword"
                component={TextField}
                label={t('forms:confirmNewPassword')}
                type="password"
            />
            <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
        </Form>
    );

    const renderPasswordForm = (
        <Formik
            initialValues={passwordFormInitialValues}
            validationSchema={passwordValidationSchema}
            onSubmit={handleSubmitPassword}
            ref={passwordFormRef}
        >
            {renderPasswordFormContent}
        </Formik>
    );

    const renderCardContent = !!token ? renderPasswordForm : emailSubmitted ? renderEmailSubmitted : renderEmailForm;

    const seoProps = {
        title: t('reset-password:title'),
        description: t('reset-password:description'),
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            header,
            dynamicBackUrl: true,
        },
        renderCardContent,
        desktopHeader: header,
        formLayout: true,
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if (authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    }

    return <SettingsLayout {...layoutProps} />;
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['reset-password']),
    },
});

export default withNoAuth(ResetPasswordPage);
