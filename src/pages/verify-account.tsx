import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { ButtonLink, FormSubmitSection, FormTemplate, LoadingTemplate } from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Form, Formik, FormikProps, FormikValues } from 'formik';
import {
  GraphQlResendVerificationEmailMutation,
  useGraphQlResendVerificationEmailMutation,
  useVerifyAccountMutation,
  VerifyAccountMutation,
} from 'generated';
import { withAuthRequired } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { urls } from 'utils';

const VerifyAccountPage: NextPage = () => {
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
  const { userMe, verified: initialVerified } = useAuthContext();
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
        next: urls.verifyAccount,
      },
    }),
    [],
  );

  // Update state whenever context value changes.
  useEffect(() => {
    setVerified(initialVerified);
  }, [initialVerified]);

  const handleUnexpectedConfirmationError = (): void =>
    setConfirmationError(t('validation:setUnexpectedFormError'));

  const onConfirmationFormCompleted = ({ verifyAccount }: VerifyAccountMutation): void => {
    if (verifyAccount?.errors?.length) {
      verifyAccount.errors.map((e) => {
        if (e?.field === '__all__') {
          setConfirmationError(!e ? null : formatFormError(e));
        }
      });
    } else if (verifyAccount?.successMessage) {
      toggleNotification(verifyAccount.successMessage);
      setVerified(true);
    } else {
      handleUnexpectedConfirmationError();
    }
  };

  const [verifyAccount, { loading, called }] = useVerifyAccountMutation({
    onCompleted: onConfirmationFormCompleted,
    onError: handleUnexpectedConfirmationError,
    context,
  });

  useEffect(() => {
    const handleVerifyAccount = async (): Promise<void> => {
      await verifyAccount({ variables: { token } });
    };

    if (!!token && !verified && !initialVerified && !called) {
      handleVerifyAccount();
    }
  }, [token, verified, initialVerified, verifyAccount, called]);

  const onCompleted = ({
    resendVerificationEmail,
  }: GraphQlResendVerificationEmailMutation): void => {
    if (resendVerificationEmail?.errors?.length) {
      handleMutationErrors(resendVerificationEmail.errors);
    } else if (resendVerificationEmail?.successMessage) {
      formRef.current?.resetForm();
      toggleNotification(resendVerificationEmail.successMessage);
      setEmailSubmitted(true);
    } else {
      setUnexpectedFormError();
    }
  };

  const [resendVerificationEmail] = useGraphQlResendVerificationEmailMutation({
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
          href={urls.home}
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
          {t('verify-account:verified')}
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
          {t('verify-account:loginText')}
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
            {t('verify-account:emailHelpText')}
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
          {t('verify-account:emailSubmitted')}
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
      title: t('verify-account:title'),
    },
    topNavbarProps: {
      header: t('verify-account:header'),
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
    _ns: await loadNamespaces(['verify-account'], locale),
  },
});

export default withAuthRequired(VerifyAccountPage);
