import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { ButtonLink, FormSubmitSection, FormTemplate, LoadingTemplate } from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Form, Formik, FormikProps, FormikValues } from 'formik';
import {
  GraphQlResendBackupEmailVerificationEmailMutation,
  useGraphQlResendBackupEmailVerificationEmailMutation,
  useVerifyBackupEmailMutation,
  VerifyBackupEmailMutation,
} from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { urls } from 'utils';

const VerifyBackupEmailPage: NextPage = () => {
  const {
    formRef,
    handleMutationErrors,
    onError,
    setUnexpectedFormError,
    formatFormError,
    generalFormValues,
  } = useForm<FormikValues>();

  const { t } = useTranslation();
  const { query } = useRouter();
  const { userMe, verifiedBackupEmail: initialVerifiedBackupEmail } = useAuthContext();
  const token = query.token ? String(query.token) : '';
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(false);
  const [confirmationError, setConfirmationError] = useState<string | null>();
  const { toggleNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();

  const loginButtonHref = useMemo(
    () => ({
      pathname: urls.login,
      query: {
        next: urls.verifyBackupEmail,
      },
    }),
    [],
  );

  // Update state whenever context value changes.
  useEffect(() => {
    setVerified(initialVerifiedBackupEmail);
  }, [initialVerifiedBackupEmail]);

  const handleUnexpectedConfirmationError = (): void =>
    setConfirmationError(t('validation:setUnexpectedFormError'));

  const onConfirmationFormCompleted = ({ verifyBackupEmail }: VerifyBackupEmailMutation): void => {
    if (verifyBackupEmail?.errors?.length) {
      verifyBackupEmail.errors.map((e) => {
        if (e?.field === '__all__') {
          setConfirmationError(!e ? null : formatFormError(e));
        }
      });
    } else if (verifyBackupEmail?.successMessage) {
      toggleNotification(verifyBackupEmail.successMessage);
      setVerified(true);
    } else {
      handleUnexpectedConfirmationError();
    }
  };

  const [verifyBackupEmail, { loading, called }] = useVerifyBackupEmailMutation({
    onCompleted: onConfirmationFormCompleted,
    onError: handleUnexpectedConfirmationError,
    context,
  });

  useEffect(() => {
    const handleVerifyBackupEmail = async (): Promise<void> => {
      await verifyBackupEmail({ variables: { token } });
    };

    if (!!token && !verified && !initialVerifiedBackupEmail && !called) {
      handleVerifyBackupEmail();
    }
  }, [token, verified, initialVerifiedBackupEmail, verifyBackupEmail, called]);

  const onCompleted = ({
    resendBackupEmailVerificationEmail,
  }: GraphQlResendBackupEmailVerificationEmailMutation): void => {
    if (resendBackupEmailVerificationEmail?.errors?.length) {
      handleMutationErrors(resendBackupEmailVerificationEmail.errors);
    } else if (resendBackupEmailVerificationEmail?.successMessage) {
      formRef.current?.resetForm();
      toggleNotification(resendBackupEmailVerificationEmail.successMessage);
      setEmailSubmitted(true);
    } else {
      setUnexpectedFormError();
    }
  };

  const [resendVerificationEmail] = useGraphQlResendBackupEmailVerificationEmailMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmitEmail = useCallback(async (): Promise<void> => {
    await resendVerificationEmail();
  }, [resendVerificationEmail]);

  const renderContinueButton = useMemo(
    () => (
      <FormControl>
        <ButtonLink
          href={urls.accountSettings}
          endIcon={<ArrowForwardOutlined />}
          color="primary"
          variant="contained"
        >
          {t('common:continue')}
        </ButtonLink>
      </FormControl>
    ),
    [t],
  );

  const renderLoginButton = useMemo(
    () => (
      <FormControl>
        <ButtonLink
          href={loginButtonHref}
          endIcon={<ArrowForwardOutlined />}
          color="primary"
          variant="contained"
        >
          {t('common:login')}
        </ButtonLink>
      </FormControl>
    ),
    [loginButtonHref, t],
  );

  const renderVerifiedText = useMemo(
    () => (
      <FormControl>
        <Typography className="form-text" variant="subtitle1">
          {t('verify-backup-email:verified')}
        </Typography>
      </FormControl>
    ),
    [t],
  );

  const renderConfirmationErrorText = useMemo(
    () => (
      <FormControl>
        <Typography className="form-text" color="error" variant="subtitle1">
          {confirmationError}
        </Typography>
      </FormControl>
    ),
    [confirmationError],
  );

  const renderLoginText = useMemo(
    () => (
      <FormControl>
        <Typography className="form-text" variant="subtitle1">
          {t('verify-backup-email:loginText')}
        </Typography>
      </FormControl>
    ),
    [t],
  );

  const renderEmailFormFields = useCallback(
    (props: FormikProps<FormikValues>): JSX.Element => (
      <Form>
        <FormControl>
          <Typography className="form-text" variant="subtitle1">
            {t('verify-backup-email:emailHelpText')}
          </Typography>
        </FormControl>
        <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
      </Form>
    ),
    [t],
  );

  // Render for unauthenticated users with no token.
  const renderLoginError = useMemo(
    () =>
      !userMe &&
      !token && (
        <>
          {renderLoginText}
          {renderLoginButton}
        </>
      ),
    [renderLoginButton, renderLoginText, token, userMe],
  );

  // Render for unverified, authenticated users with no token.
  const renderEmailForm = useMemo(
    () =>
      verified === false &&
      !token &&
      !emailSubmitted && (
        <Formik initialValues={generalFormValues} onSubmit={handleSubmitEmail} innerRef={formRef}>
          {renderEmailFormFields}
        </Formik>
      ),
    [
      emailSubmitted,
      formRef,
      generalFormValues,
      handleSubmitEmail,
      renderEmailFormFields,
      token,
      verified,
    ],
  );

  const renderEmailSubmittedText = useMemo(
    () => (
      <FormControl>
        <Typography className="form-text" variant="subtitle1">
          {t('verify-backup-email:emailSubmitted')}
        </Typography>
      </FormControl>
    ),
    [t],
  );

  // Render after email form has been submitted.
  const renderEmailSubmitted = useMemo(
    () =>
      verified === false &&
      !token &&
      emailSubmitted && (
        <>
          {renderEmailSubmittedText}
          {renderContinueButton}
        </>
      ),
    [emailSubmitted, renderContinueButton, renderEmailSubmittedText, token, verified],
  );

  // Render for authenticated, verified users.
  const renderVerified = useMemo(
    () =>
      !!verified &&
      !confirmationError && (
        <>
          {renderVerifiedText}
          {renderContinueButton}
        </>
      ),
    [confirmationError, renderContinueButton, renderVerifiedText, verified],
  );

  // Render in case an error occurs during the verification.
  const renderConfirmationError = useMemo(
    () =>
      !!confirmationError && (
        <>
          {renderConfirmationErrorText}
          {renderContinueButton}
        </>
      ),
    [confirmationError, renderConfirmationErrorText, renderContinueButton],
  );

  const renderContent = useMemo(
    () =>
      renderLoginError ||
      renderEmailForm ||
      renderEmailSubmitted ||
      renderVerified ||
      renderConfirmationError,
    [
      renderLoginError,
      renderEmailForm,
      renderEmailSubmitted,
      renderVerified,
      renderConfirmationError,
    ],
  );

  const layoutProps = {
    seoProps: {
      title: t('verify-backup-email:title'),
    },
    topNavbarProps: {
      header: t('verify-backup-email:header'),
      emoji: '✅',
    },
  };

  if (loading) {
    return <LoadingTemplate />;
  }

  return <FormTemplate {...layoutProps}>{renderContent}</FormTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['verify-backup-email'], locale),
  },
});

export default withUserMe(VerifyBackupEmailPage);
