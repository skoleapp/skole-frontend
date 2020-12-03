import { Box, FormControl, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, FormSubmitSection, SettingsTemplate } from 'components';
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
import { urls } from 'utils';

interface EmailFormValues {
  email: string;
  general: string;
}

const VerifyAccountPage: NextPage = () => {
  const {
    formRef: emailFormRef,
    handleMutationErrors: handleEmailFormMutationErrors,
    onError: onEmailFormError,
    resetForm: resetEmailForm,
    unexpectedError: emailFormUnexpectedError,
  } = useForm<EmailFormValues>();

  const { t } = useTranslation();
  const { query } = useRouter();
  const { userMe, verified: initialVerified } = useAuthContext();
  const email = R.propOr('', 'email', userMe);
  const token = query.token ? String(query.token) : '';
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(false);
  const [confirmationError, setConfirmationError] = useState<string | null>(null);

  const { toggleNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();

  // Update state whenever context value changes.
  useEffect(() => {
    setVerified(initialVerified);
  }, [initialVerified]);

  const handleUnexpectedConfirmationError = (): void => {
    setConfirmationError(t('validation:unexpectedError'));
  };

  const onConfirmationFormCompleted = ({ verifyAccount }: VerifyAccountMutation): void => {
    if (verifyAccount) {
      if (!!verifyAccount.errors && !!verifyAccount.errors.length) {
        verifyAccount.errors.map((e) => {
          if (e?.field === '__all__') {
            setConfirmationError(e?.messages.join());
          }
        });
      } else if (verifyAccount.successMessage) {
        toggleNotification(verifyAccount.successMessage);
        setVerified(true);
      } else {
        handleUnexpectedConfirmationError();
      }
    } else {
      handleUnexpectedConfirmationError();
    }
  };

  const [verifyAccount] = useVerifyAccountMutation({
    onCompleted: onConfirmationFormCompleted,
    onError: handleUnexpectedConfirmationError,
    context,
  });

  useEffect(() => {
    const handleVerifyAccount = async (): Promise<void> => {
      await verifyAccount({ variables: { token } });
    };
    if (!!token && !verified && !initialVerified) {
      handleVerifyAccount();
    }
  }, [token]);

  const header = !emailSubmitted
    ? t('verify-account:header')
    : t('verify-account:emailSubmittedHeader');

  const onEmailFormCompleted = ({
    resendVerificationEmail,
  }: ResendVerificationEmailMutation): void => {
    if (resendVerificationEmail) {
      if (!!resendVerificationEmail.errors && !!resendVerificationEmail.errors.length) {
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

  const [resendVerificationEmail] = useResendVerificationEmailMutation({
    onCompleted: onEmailFormCompleted,
    onError: onEmailFormError,
    context,
  });

  const handleSubmitEmail = async (): Promise<void> => {
    await resendVerificationEmail({ variables: { email } });
  };

  const initialEmailFormValues = {
    email,
    general: '',
  };

  const renderHomeButton = (
    <ButtonLink
      href={urls.home}
      endIcon={<ArrowForwardOutlined />}
      color="primary"
      variant="contained"
      fullWidth
    >
      {t('common:continue')}
    </ButtonLink>
  );

  const renderEmailForm = !verified && !token && !emailSubmitted && (
    <Formik
      initialValues={initialEmailFormValues}
      onSubmit={handleSubmitEmail}
      innerRef={emailFormRef}
      enableReinitialize
    >
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

  const renderEmailSubmitted = verified === false && !token && emailSubmitted && (
    <FormControl>
      <Typography variant="subtitle1" align="center">
        {t('verify-account:emailSubmitted')}
      </Typography>
      <Typography component="br" />
    </FormControl>
  );

  const renderVerified = verified && (
    <FormControl>
      <Typography variant="subtitle1" align="center">
        {t('verify-account:verified')}
      </Typography>
      <Typography component="br" />
      {renderHomeButton}
    </FormControl>
  );
  const renderConfirmationError = !!confirmationError && !verified && (
    <FormControl>
      <Typography color="error" variant="subtitle1" align="center">
        {confirmationError}
      </Typography>
      <Typography component="br" />
      {renderHomeButton}
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
    <SettingsTemplate {...layoutProps}>
      {renderEmailForm}
      {renderEmailSubmitted}
      {renderConfirmationError}
      {renderVerified}
    </SettingsTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['verify-account'], locale),
  },
});

export default withAuth(VerifyAccountPage);
