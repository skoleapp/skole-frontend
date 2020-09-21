import { Box, FormControl, Typography } from '@material-ui/core';
import { FormSubmitSection, LoadingLayout, OfflineLayout, SettingsLayout } from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Form, Formik } from 'formik';
import {
    ResendVerificationEmailMutation,
    useResendVerificationEmailMutation,
    useVerifyAccountMutation,
    VerifyAccountMutation,
} from 'generated/graphql';
import { useForm } from 'hooks';
import { includeDefaultNamespaces, useTranslation, withAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useState } from 'react';
import { AuthProps } from 'types';

const VerifyAccountPage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
    const {
        ref: emailFormRef,
        setSubmitting: setSubmittingEmailForm,
        handleMutationErrors: handleEmailFormMutationErrors,
        onError: onEmailFormError,
        resetForm: resetEmailForm,
        unexpectedError: emailFormUnexpectedError,
    } = useForm<{}>();

    const {
        ref: confirmationFormRef,
        setSubmitting: setSubmittingConfirmationForm,
        handleMutationErrors: handleConfirmationFormMutationErrors,
        onError: onConfirmationFormError,
        resetForm: resetConfirmationForm,
        unexpectedError: confirmationFormUnexpectedError,
    } = useForm<{}>();

    const { t } = useTranslation();
    const { query } = useRouter();
    const { userMe, verified: initialVerified } = useAuthContext();
    const email = R.propOr('', 'email', userMe) as string;
    const token = (query.token as string) || '';
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [verified, setVerified] = useState(initialVerified);
    const { toggleNotification } = useNotificationsContext();
    const header = !emailSubmitted ? t('verify-account:header') : t('verify-account:emailSubmittedHeader');

    const onEmailFormCompleted = ({ resendVerificationEmail }: ResendVerificationEmailMutation): void => {
        if (!!resendVerificationEmail) {
            if (!!resendVerificationEmail.errors && !!resendVerificationEmail.errors.length) {
                handleEmailFormMutationErrors(resendVerificationEmail.errors);
            } else if (!!resendVerificationEmail.message) {
                resetEmailForm();
                toggleNotification(resendVerificationEmail.message);
                setEmailSubmitted(true);
            } else {
                emailFormUnexpectedError();
            }
        } else {
            emailFormUnexpectedError();
        }
    };

    const onConfirmationFormCompleted = ({ verifyAccount }: VerifyAccountMutation): void => {
        if (!!verifyAccount) {
            if (!!verifyAccount.errors && !!verifyAccount.errors.length) {
                handleConfirmationFormMutationErrors(verifyAccount.errors);
            } else if (!!verifyAccount.message) {
                resetConfirmationForm();
                toggleNotification(verifyAccount.message);
                setVerified(true);
            } else {
                confirmationFormUnexpectedError();
            }
        } else {
            confirmationFormUnexpectedError();
        }
    };

    const [resendVerificationEmail] = useResendVerificationEmailMutation({
        onCompleted: onEmailFormCompleted,
        onError: onEmailFormError,
    });

    const [verifyAccount] = useVerifyAccountMutation({
        onCompleted: onConfirmationFormCompleted,
        onError: onConfirmationFormError,
    });

    const handleSubmitEmail = async (): Promise<void> => {
        await resendVerificationEmail({ variables: { email } });
        setSubmittingEmailForm(false);
    };

    const handleSubmitConfirmation = async (): Promise<void> => {
        await verifyAccount({ variables: { token } });
        setSubmittingConfirmationForm(false);
    };

    const initialEmailFormValues = {
        email: R.propOr('', 'email', userMe) as string,
        general: '',
    };

    const initialConfirmationFormValues = {
        general: '',
    };

    const renderEmailForm = !verified && !token && !emailSubmitted && (
        <Formik initialValues={initialEmailFormValues} onSubmit={handleSubmitEmail} ref={emailFormRef}>
            {(props): JSX.Element => (
                <Form>
                    <Box flexGrow="1" textAlign="center">
                        <Typography variant="body2">{t('verify-account:emailHelpText')}</Typography>
                    </Box>
                    <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
                </Form>
            )}
        </Formik>
    );

    const renderEmailSubmitted = !verified && !token && emailSubmitted && (
        <FormControl>
            <Typography variant="subtitle1" align="center">
                {t('verify-account:emailSubmitted')}
            </Typography>
        </FormControl>
    );

    const renderConfirmationForm = !verified && !!token && (
        <Formik
            initialValues={initialConfirmationFormValues}
            onSubmit={handleSubmitConfirmation}
            ref={confirmationFormRef}
        >
            {(props): JSX.Element => (
                <Form>
                    <Box flexGrow="1" textAlign="center">
                        <Typography variant="body2">{t('verify-account:confirmationHelpText')}</Typography>
                    </Box>
                    <FormSubmitSection submitButtonText={t('common:confirm')} {...props} />
                </Form>
            )}
        </Formik>
    );

    const renderVerified = verified && (
        <FormControl>
            <Typography variant="subtitle1" align="center">
                {t('verify-account:verified')}
            </Typography>
        </FormControl>
    );

    const seoProps = {
        title: t('verify-account:title'),
        description: t('verify-account:description'),
    };

    const layoutProps = {
        seoProps,
        header,
        dense: true,
        topNavbarProps: {
            dynamicBackUrl: true,
        },
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if (authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    }

    return (
        <SettingsLayout {...layoutProps}>
            {renderEmailForm}
            {renderEmailSubmitted}
            {renderConfirmationForm}
            {renderVerified}
        </SettingsLayout>
    );
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['verify-account']),
    },
});

export default withAuth(VerifyAccountPage);
