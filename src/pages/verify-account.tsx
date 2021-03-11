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
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { SeoPageProps } from 'types';
import { urls } from 'utils';

const VerifyAccountPage: NextPage<SeoPageProps> = ({ seoProps }) => {
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

  const loginButtonHref = {
    pathname: urls.login,
    query: {
      next: urls.verifyAccount,
    },
  };

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

  const handleSubmitEmail = async (): Promise<void> => {
    await resendVerificationEmail();
  };

  const renderContinueButton = (
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
  );

  const renderLoginButton = (
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
  );

  const renderVerifiedText = (
    <FormControl>
      <Typography className="form-text" variant="subtitle1">
        {t('verify-account:verified')}
      </Typography>
    </FormControl>
  );

  const renderConfirmationErrorText = (
    <FormControl>
      <Typography className="form-text" color="error" variant="subtitle1">
        {confirmationError}
      </Typography>
    </FormControl>
  );

  const renderLoginText = (
    <FormControl>
      <Typography className="form-text" variant="subtitle1">
        {t('verify-account:loginText')}
      </Typography>
    </FormControl>
  );

  const renderEmailFormFields = (props: FormikProps<FormikValues>): JSX.Element => (
    <Form>
      <FormControl>
        <Typography className="form-text" variant="subtitle1">
          {t('verify-account:emailHelpText')}
        </Typography>
      </FormControl>
      <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
    </Form>
  );

  // Render for unauthenticated users with no token.
  const renderLoginError = !userMe && !token && (
    <>
      {renderLoginText}
      {renderLoginButton}
    </>
  );

  // Render for unverified, authenticated users with no token.
  const renderEmailForm = verified === false && !token && !emailSubmitted && (
    <Formik initialValues={generalFormValues} onSubmit={handleSubmitEmail} innerRef={formRef}>
      {renderEmailFormFields}
    </Formik>
  );

  const renderEmailSubmittedText = (
    <FormControl>
      <Typography className="form-text" variant="subtitle1">
        {t('verify-account:emailSubmitted')}
      </Typography>
    </FormControl>
  );

  // Render after email form has been submitted.
  const renderEmailSubmitted = verified === false && !token && emailSubmitted && (
    <>
      {renderEmailSubmittedText}
      {renderContinueButton}
    </>
  );

  // Render for authenticated, verified users.
  const renderVerified = !!verified && !confirmationError && (
    <>
      {renderVerifiedText}
      {renderContinueButton}
    </>
  );

  // Render in case an error occurs during the verification.
  const renderConfirmationError = !!confirmationError && (
    <>
      {renderConfirmationErrorText}
      {renderContinueButton}
    </>
  );

  const renderContent =
    renderLoginError ||
    renderEmailForm ||
    renderEmailSubmitted ||
    renderVerified ||
    renderConfirmationError;

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: t('verify-account:header'),
      emoji: '✅',
    },
  };

  if (loading) {
    return <LoadingTemplate seoProps={seoProps} />;
  }

  return <FormTemplate {...layoutProps}>{renderContent}</FormTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'verify-account');

  return {
    props: {
      _ns: await loadNamespaces(['verify-account'], locale),
      seoProps: {
        title: t('title'),
      },
    },
  };
};

export default withUserMe(VerifyAccountPage);
