import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { ButtonLink, Emoji, FormSubmitSection, FormTemplate, LoadingTemplate } from 'components';
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
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { SeoPageProps } from 'types';
import { urls } from 'utils';

interface EmailFormValues {
  general: string;
}

const VerifyAccountPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const {
    formRef,
    handleMutationErrors,
    onError,
    setUnexpectedFormError,
    formatFormError,
  } = useForm<EmailFormValues>();

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

  const [verifyAccount, { loading }] = useVerifyAccountMutation({
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

  const header = (
    <>
      {t('verify-account:header')}
      <Emoji emoji="✅" />
    </>
  );

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

  const renderLoginButton = (
    <ButtonLink
      href={loginButtonHref}
      endIcon={<ArrowForwardOutlined />}
      color="primary"
      variant="contained"
      fullWidth
    >
      {t('common:login')}
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
      <Typography variant="subtitle1" align="center">
        {t('verify-account:emailHelpText')}
      </Typography>
      <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
    </Form>
  );

  // Render for unauthenticated users with no token.
  const renderLoginError = !userMe && !token && (
    <FormControl>
      {renderLoginText}
      {renderLineBreak}
      {renderLoginButton}
    </FormControl>
  );

  // Render for unverified, authenticated users with no token.
  const renderEmailForm = verified === false && !token && !emailSubmitted && (
    <Formik initialValues={initialValues} onSubmit={handleSubmitEmail} innerRef={formRef}>
      {renderEmailFormFields}
    </Formik>
  );

  // Render after email form has been submitted.
  const renderEmailSubmitted = verified === false && !token && emailSubmitted && (
    <FormControl>{renderEmailSubmittedText}</FormControl>
  );

  // Render for authenticated, verified users.
  const renderVerified = !!verified && !confirmationError && (
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

  const renderContent =
    renderLoginError ||
    renderEmailForm ||
    renderEmailSubmitted ||
    renderVerified ||
    renderConfirmationError;

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header,
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
