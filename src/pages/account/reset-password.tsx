import { FormControl, Typography } from '@material-ui/core';
import { FormSubmitSection, SettingsLayout, TextFormField } from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
    ResetPasswordMutation,
    SendPasswordResetEmailMutation,
    useResetPasswordMutation,
    useSendPasswordResetEmailMutation,
} from 'generated';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation, withNoAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Router from 'next/router';
import React, { useState } from 'react';
import { urls } from 'utils';
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

const ResetPasswordPage: NextPage = () => {
    const {
        formRef: emailFormRef,
        handleMutationErrors: handleEmailFormMutationErrors,
        onError: onEmailFormError,
        resetForm: resetEmailForm,
        unexpectedError: emailFormUnexpectedError,
    } = useForm<EmailFormValues>();

    const {
        formRef: passwordFormRef,
        handleMutationErrors: handlePasswordFormMutationErrors,
        onError: onPasswordFormError,
        resetForm: resetPasswordForm,
        unexpectedError: passwordFormUnexpectedError,
    } = useForm<PasswordFormValues>();

    const { t } = useTranslation();
    const { query } = useRouter();
    const token = !!query.token ? String(query.token) : '';
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const { toggleNotification } = useNotificationsContext();
    const header = !emailSubmitted ? t('reset-password:header') : t('reset-password:emailSubmittedHeader');
    const context = useLanguageHeaderContext();

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
            if (sendPasswordResetEmail.errors && !!sendPasswordResetEmail.errors.length) {
                handleEmailFormMutationErrors(sendPasswordResetEmail.errors);
            } else if (sendPasswordResetEmail.successMessage) {
                resetEmailForm();
                toggleNotification(sendPasswordResetEmail.successMessage);
                setEmailSubmitted(true);
            } else {
                emailFormUnexpectedError();
            }
        }
    };

    const onPasswordFormCompleted = async ({ resetPassword }: ResetPasswordMutation): Promise<void> => {
        if (!!resetPassword) {
            if (!!resetPassword.errors && !!resetPassword.errors.length) {
                handlePasswordFormMutationErrors(resetPassword.errors);
            } else if (!!resetPassword.successMessage) {
                resetPasswordForm();
                toggleNotification(resetPassword.successMessage);
                await Router.push(urls.logout);
            } else {
                passwordFormUnexpectedError();
            }
        }
    };

    const [sendPasswordResetEmail] = useSendPasswordResetEmailMutation({
        onCompleted: onEmailFormCompleted,
        onError: onEmailFormError,
        context,
    });

    const [resetPassword] = useResetPasswordMutation({
        onCompleted: onPasswordFormCompleted,
        onError: onPasswordFormError,
        context,
    });

    const handleSubmitEmail = async (values: EmailFormValues): Promise<void> => {
        const { email } = values;
        await sendPasswordResetEmail({ variables: { email } });
    };

    const handleSubmitPassword = async (values: PasswordFormValues): Promise<void> => {
        const { newPassword } = values;
        await resetPassword({ variables: { newPassword, token } });
    };

    const renderEmailFormContent = (props: FormikProps<EmailFormValues>): JSX.Element => (
        <Form>
            <Field
                name="email"
                component={TextFormField}
                label={t('forms:email')}
                helperText={t('reset-password:helpText')}
            />
            <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
        </Form>
    );

    const renderPasswordFormContent = (props: FormikProps<PasswordFormValues>): JSX.Element => (
        <Form>
            <Field name="newPassword" component={TextFormField} label={t('forms:newPassword')} type="password" />
            <Field
                name="confirmNewPassword"
                component={TextFormField}
                label={t('forms:confirmNewPassword')}
                type="password"
            />
            <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
        </Form>
    );

    const renderPasswordForm = !!token && (
        <Formik
            initialValues={passwordFormInitialValues}
            validationSchema={passwordValidationSchema}
            onSubmit={handleSubmitPassword}
            ref={passwordFormRef}
        >
            {renderPasswordFormContent}
        </Formik>
    );

    const renderEmailForm = !token && !emailSubmitted && (
        <Formik
            initialValues={emailFormInitialValues}
            validationSchema={emailValidationSchema}
            onSubmit={handleSubmitEmail}
            ref={emailFormRef}
        >
            {renderEmailFormContent}
        </Formik>
    );

    const renderEmailSubmitted = !token && emailSubmitted && (
        <FormControl>
            <Typography variant="subtitle1" align="center">
                {t('reset-password:emailSubmitted')}
            </Typography>
        </FormControl>
    );

    const layoutProps = {
        seoProps: {
            title: t('reset-password:title'),
            description: t('reset-password:description'),
        },
        header,
        dense: true,
        topNavbarProps: {
            dynamicBackUrl: true,
        },
    };

    return (
        <SettingsLayout {...layoutProps}>
            {renderPasswordForm}
            {renderEmailForm}
            {renderEmailSubmitted}
        </SettingsLayout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        _ns: await loadNamespaces(['reset-password'], locale),
    },
});

export default withNoAuth(ResetPasswordPage);
