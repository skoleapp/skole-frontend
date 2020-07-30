import { Box, Typography } from '@material-ui/core';
import { FormSubmitSection, SettingsLayout } from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Form, Formik } from 'formik';
import {
    ResendVerificationEmailMutation,
    useResendVerificationEmailMutation,
    useVerifyAccountMutation,
    VerifyAccountMutation,
} from 'generated/graphql';
import { useForm } from 'hooks';
import { includeDefaultNamespaces, useTranslation, withAuth, withUserAgent, withUserMe } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useState } from 'react';
import { I18nProps } from 'types';

const VerifyAccountPage: NextPage<I18nProps> = () => {
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

    const onEmailFormCompleted = ({ resendVerificationEmail }: ResendVerificationEmailMutation): void => {
        if (!!resendVerificationEmail) {
            if (!!resendVerificationEmail.errors) {
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
            if (!!verifyAccount.errors) {
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

    const renderVerified = (
        <Box flexGrow="1" textAlign="center">
            <Typography variant="body2">{t('verify-account:verified')}</Typography>
        </Box>
    );

    const renderEmailForm = (
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

    const renderEmailSubmitted = (
        <Box textAlign="center">
            <Typography variant="body2">{t('verify-account:emailSubmitted')}</Typography>
        </Box>
    );

    const renderConfirmationForm = (
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

    const renderCardContent = verified
        ? renderVerified
        : !!token
        ? renderConfirmationForm
        : emailSubmitted
        ? renderEmailSubmitted
        : renderEmailForm;

    const layoutProps = {
        seoProps: {
            title: t('verify-account:title'),
            description: t('verify-account:description'),
        },
        topNavbarProps: {
            header: t('verify-account:header'),
            dynamicBackUrl: true,
        },
        renderCardContent,
        desktopHeader: t('verify-account:header'),
        formLayout: true,
    };

    return <SettingsLayout {...layoutProps} />;
};

const wrappers = R.compose(withUserAgent, withUserMe);

export const getServerSideProps: GetServerSideProps = wrappers(async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['verify-account']),
    },
}));

export default withAuth(VerifyAccountPage);
