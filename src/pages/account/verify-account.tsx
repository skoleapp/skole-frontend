import { Box, FormControl, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, FormSubmitSection, FormTemplate } from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Form, Formik, FormikProps } from 'formik';
import {
  GraphQlResendVerificationEmailMutation,
  useGraphQlResendVerificationEmailMutation,
  useVerifyAccountMutation,
  VerifyAccountMutation,
} from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { urls } from 'utils';

interface EmailFormValues {
  general: string;
}

const VerifyAccountPage: NextPage = () => {
  const {
    formRef,
    handleMutationErrors,
    onError,
    setUnexpectedFormError,
    formatFormError,
  } = useForm<EmailFormValues>();

  const { t } = useTranslation();
  const { query } = useRouter();
  const { verified: initialVerified } = useAuthContext();
  const token = query.token ? String(query.token) : '';
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(false);
  const [confirmationError, setConfirmationError] = useState<string | null>();
  const { toggleNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();

  // Update state whenever context value changes.
  useEffect(() => {
    setVerified(initialVerified);
  }, [initialVerified]);

  const handleUnexpectedConfirmationError = (): void =>
    setConfirmationError(t('validation:setUnexpectedFormError'));

  const onConfirmationFormCompleted = ({ verifyAccount }: VerifyAccountMutation): void => {
    if (verifyAccount) {
      if (!!verifyAccount.errors && !!verifyAccount.errors.length) {
        verifyAccount.errors.map((e) => {
          if (e?.field === '__all__') {
            setConfirmationError(!e ? null : formatFormError(e));
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

  const onCompleted = ({
    resendVerificationEmail,
  }: GraphQlResendVerificationEmailMutation): void => {
    if (resendVerificationEmail) {
      if (!!resendVerificationEmail.errors && !!resendVerificationEmail.errors.length) {
        handleMutationErrors(resendVerificationEmail.errors);
      } else if (resendVerificationEmail.successMessage) {
        formRef.current?.resetForm();
        toggleNotification(resendVerificationEmail.successMessage);
        setEmailSubmitted(true);
      } else {
        setUnexpectedFormError();
      }
    } else {
      setUnexpectedFormError();
    }
  };

  const [resendVerificationEmail] = useGraphQlResendVerificationEmailMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmitEmail = async (): Promise<void> => {
    await resendVerificationEmail();
  };

  const initialValues = {
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

  const renderLineBreak = <Typography component="br" />;

  const renderEmailSubmittedText = (
    <Typography variant="subtitle1" align="center">
      {t('verify-account:emailSubmitted')}
    </Typography>
  );

  const renderVerifiedText = (
    <Typography variant="subtitle1" align="center">
      {t('verify-account:verified')}
    </Typography>
  );

  const renderConfirmationErrorText = (
    <Typography color="error" variant="subtitle1" align="center">
      {confirmationError}
    </Typography>
  );

  const renderLoginText = (
    <Typography variant="subtitle1" align="center">
      {t('verify-account:loginText')}
    </Typography>
  );

  const renderEmailFormFields = (props: FormikProps<EmailFormValues>): JSX.Element => (
    <Form>
      <Box flexGrow="1" textAlign="center">
        <Typography variant="body2">{t('verify-account:emailHelpText')}</Typography>
      </Box>
      <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
    </Form>
  );

  // Render for unverified users.
  const renderEmailForm = verified === false && !token && !emailSubmitted && (
    <Formik initialValues={initialValues} onSubmit={handleSubmitEmail} innerRef={formRef}>
      {renderEmailFormFields}
    </Formik>
  );

  // Render for unauthenticated users with no token.
  const renderLoginError = !verified && !token && (
    <FormControl>
      {renderLoginText}
      {renderLineBreak}
      {renderHomeButton}
    </FormControl>
  );

  // Render after email has been submitted.
  const renderEmailSubmitted = verified === false && !token && emailSubmitted && (
    <FormControl>{renderEmailSubmittedText}</FormControl>
  );

  // Render for verified users and after successful verification.
  const renderVerified = verified && !confirmationError && (
    <FormControl>
      {renderVerifiedText}
      {renderLineBreak}
      {renderHomeButton}
    </FormControl>
  );

  // Render in case an error occurs during the verification.
  const renderConfirmationError = !!confirmationError && (
    <FormControl>
      {renderConfirmationErrorText}
      {renderLineBreak}
      {renderHomeButton}
    </FormControl>
  );

  const layoutProps = {
    seoProps: {
      title: t('verify-account:title'),
      description: t('verify-account:description'),
    },
    header,
    topNavbarProps: {
      dynamicBackUrl: true,
    },
  };

  return (
    <FormTemplate {...layoutProps}>
      {renderEmailForm}
      {renderEmailSubmitted}
      {renderConfirmationError}
      {renderLoginError}
      {renderVerified}
    </FormTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['verify-account'], locale),
  },
});

export default withUserMe(VerifyAccountPage);
