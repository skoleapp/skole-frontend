import { Box, FormControl, Typography } from '@material-ui/core';
import { FormSubmitSection, SettingsLayout } from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Form, Formik } from 'formik';
import {
  ResendVerificationEmailMutation,
  useResendVerificationEmailMutation,
  useVerifyAccountMutation,
  VerifyAccountMutation,
} from 'generated';
import { withAuth } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useEffect, useState } from 'react';

const VerifyAccountPage: NextPage = () => {
  const {
    formRef: emailFormRef,
    handleMutationErrors: handleEmailFormMutationErrors,
    onError: onEmailFormError,
    resetForm: resetEmailForm,
    unexpectedError: emailFormUnexpectedError,
  } = useForm<Record<symbol, unknown>>();

  const {
    formRef: confirmationFormRef,
    handleMutationErrors: handleConfirmationFormMutationErrors,
    onError: onConfirmationFormError,
    resetForm: resetConfirmationForm,
    unexpectedError: confirmationFormUnexpectedError,
  } = useForm<Record<symbol, unknown>>();

  const { t } = useTranslation();
  const { query } = useRouter();
  const { userMe, verified: initialVerified } = useAuthContext();
  const email: string = R.propOr('', 'email', userMe);
  const token = query.token ? String(query.token) : '';
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(false);
  const { toggleNotification } = useNotificationsContext();
  const header = !emailSubmitted
    ? t('verify-account:header')
    : t('verify-account:emailSubmittedHeader');
  const context = useLanguageHeaderContext();

  useEffect(() => {
    setVerified(initialVerified);
  }, [initialVerified]);

  const onEmailFormCompleted = ({
    resendVerificationEmail,
  }: ResendVerificationEmailMutation): void => {
    if (resendVerificationEmail) {
      if (
        !!resendVerificationEmail.errors &&
        !!resendVerificationEmail.errors.length
      ) {
        handleEmailFormMutationErrors(resendVerificationEmail.errors);
      } else if (resendVerificationEmail.successMessage) {
        resetEmailForm();
        toggleNotification(resendVerificationEmail.successMessage);
        setEmailSubmitted(true);
      } else {
        emailFormUnexpectedError();
      }
    } else {
      emailFormUnexpectedError();
    }
  };

  const onConfirmationFormCompleted = ({
    verifyAccount,
  }: VerifyAccountMutation): void => {
    if (verifyAccount) {
      if (!!verifyAccount.errors && !!verifyAccount.errors.length) {
        handleConfirmationFormMutationErrors(verifyAccount.errors);
      } else if (verifyAccount.successMessage) {
        resetConfirmationForm();
        toggleNotification(verifyAccount.successMessage);
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
    context,
  });

  const [verifyAccount] = useVerifyAccountMutation({
    onCompleted: onConfirmationFormCompleted,
    onError: onConfirmationFormError,
    context,
  });

  const handleSubmitEmail = async (): Promise<void> => {
    await resendVerificationEmail({ variables: { email } });
  };

  const handleSubmitConfirmation = async (): Promise<void> => {
    await verifyAccount({ variables: { token } });
  };

  const initialEmailFormValues = {
    email,
    general: '',
  };

  const initialConfirmationFormValues = {
    general: '',
  };

  const renderEmailForm = verified === false && !token && !emailSubmitted && (
    <Formik
      initialValues={initialEmailFormValues}
      onSubmit={handleSubmitEmail}
      ref={emailFormRef}
    >
      {(props): JSX.Element => (
        <Form>
          <Box flexGrow="1" textAlign="center">
            <Typography variant="body2">
              {t('verify-account:emailHelpText')}
            </Typography>
          </Box>
          <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
        </Form>
      )}
    </Formik>
  );

  const renderEmailSubmitted = verified === false && !token && emailSubmitted && (
    <FormControl>
      <Typography variant="subtitle1" align="center">
        {t('verify-account:emailSubmitted')}
      </Typography>
    </FormControl>
  );

  const renderConfirmationForm = verified === false && !!token && (
    <Formik
      initialValues={initialConfirmationFormValues}
      onSubmit={handleSubmitConfirmation}
      ref={confirmationFormRef}
    >
      {(props): JSX.Element => (
        <Form>
          <Box flexGrow="1" textAlign="center">
            <Typography variant="body2">
              {t('verify-account:confirmationHelpText')}
            </Typography>
          </Box>
          <FormSubmitSection
            submitButtonText={t('common:confirm')}
            {...props}
          />
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

  const layoutProps = {
    seoProps: {
      title: t('verify-account:title'),
      description: t('verify-account:description'),
    },
    header,
    dense: true,
    topNavbarProps: {
      dynamicBackUrl: true,
    },
  };

  return (
    <SettingsLayout {...layoutProps}>
      {renderEmailForm}
      {renderEmailSubmitted}
      {renderConfirmationForm}
      {renderVerified}
    </SettingsLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['verify-account'], locale),
  },
});

export default withAuth(VerifyAccountPage);
