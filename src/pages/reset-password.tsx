import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { FormSubmitSection, FormTemplate, LogoutRequiredTemplate, TextFormField } from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  ResetPasswordMutation,
  SendPasswordResetEmailMutation,
  useResetPasswordMutation,
  useSendPasswordResetEmailMutation,
} from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useState } from 'react';
import { SeoPageProps } from 'types';
import { PASSWORD_MIN_LENGTH, urls } from 'utils';
import * as Yup from 'yup';

const emailFormInitialValues = {
  email: '',
};

const passwordFormInitialValues = {
  newPassword: '',
  confirmNewPassword: '',
};

interface EmailFormValues {
  email: string;
}

interface PasswordFormValues {
  newPassword: string;
  confirmNewPassword: string;
}

const ResetPasswordPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const {
    formRef: emailFormRef,
    handleMutationErrors: handleEmailFormMutationErrors,
    onError: onEmailFormError,
    setUnexpectedFormError: emailFormUnexpectedError,
  } = useForm<EmailFormValues>();

  const {
    formRef: passwordFormRef,
    handleMutationErrors: handlePasswordFormMutationErrors,
    onError: onPasswordFormError,
    setUnexpectedFormError: passwordFormUnexpectedError,
  } = useForm<PasswordFormValues>();

  const { query } = useRouter();
  const { t } = useTranslation();
  const { userMe } = useAuthContext();
  const token = query.token ? String(query.token) : '';
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const { toggleNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();

  const emailValidationSchema = Yup.object().shape({
    email: Yup.string().email(t('validation:invalidEmail')).required(t('validation:required')),
  });

  const passwordValidationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(PASSWORD_MIN_LENGTH, t('validation:passwordTooShort', { length: PASSWORD_MIN_LENGTH }))
      .required(t('validation:required')),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), ''], t('validation:passwordsNotMatch'))
      .required(t('validation:required')),
  });

  const onEmailFormCompleted = ({
    sendPasswordResetEmail,
  }: SendPasswordResetEmailMutation): void => {
    if (sendPasswordResetEmail?.errors?.length) {
      handleEmailFormMutationErrors(sendPasswordResetEmail.errors);
    } else if (sendPasswordResetEmail?.successMessage) {
      emailFormRef.current?.resetForm();
      toggleNotification(sendPasswordResetEmail.successMessage);
      setEmailSubmitted(true);
    } else {
      emailFormUnexpectedError();
    }
  };

  const onPasswordFormCompleted = async ({
    resetPassword,
  }: ResetPasswordMutation): Promise<void> => {
    if (resetPassword?.errors?.length) {
      handlePasswordFormMutationErrors(resetPassword.errors);
    } else if (resetPassword?.successMessage) {
      passwordFormRef.current?.resetForm();
      toggleNotification(resetPassword.successMessage);
      await Router.push(urls.logout);
    } else {
      passwordFormUnexpectedError();
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

  const renderNewPasswordField = (
    <Field
      name="newPassword"
      component={TextFormField}
      label={t('forms:newPassword')}
      type="password"
    />
  );

  const renderConfirmNewPasswordField = (
    <Field
      name="confirmNewPassword"
      component={TextFormField}
      label={t('forms:confirmNewPassword')}
      type="password"
    />
  );

  const renderFormSubmitSection = <T extends PasswordFormValues | EmailFormValues>(
    props: FormikProps<T>,
  ) => <FormSubmitSection submitButtonText={t('common:submit')} {...props} />;

  const renderPasswordFormFields = (props: FormikProps<PasswordFormValues>): JSX.Element => (
    <Form>
      {renderNewPasswordField}
      {renderConfirmNewPasswordField}
      {renderFormSubmitSection<PasswordFormValues>(props)}
    </Form>
  );

  const renderPasswordForm = !!token && (
    <Formik
      initialValues={passwordFormInitialValues}
      validationSchema={passwordValidationSchema}
      onSubmit={handleSubmitPassword}
      innerRef={passwordFormRef}
    >
      {renderPasswordFormFields}
    </Formik>
  );

  const renderEmailField = (
    <Field
      name="email"
      component={TextFormField}
      label={t('forms:email')}
      helperText={t('reset-password:helpText')}
    />
  );

  const renderEmailFormFields = (props: FormikProps<EmailFormValues>): JSX.Element => (
    <Form>
      {renderEmailField}
      {renderFormSubmitSection<EmailFormValues>(props)}
    </Form>
  );

  const renderEmailForm = !token && !emailSubmitted && (
    <Formik
      initialValues={emailFormInitialValues}
      validationSchema={emailValidationSchema}
      onSubmit={handleSubmitEmail}
      innerRef={emailFormRef}
    >
      {renderEmailFormFields}
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
    seoProps,
    topNavbarProps: {
      header: t('reset-password:header'),
      emoji: '😶‍🌫️',
    },
  };

  if (userMe) {
    return <LogoutRequiredTemplate {...layoutProps} />;
  }

  return (
    <FormTemplate {...layoutProps}>
      {renderPasswordForm}
      {renderEmailForm}
      {renderEmailSubmitted}
    </FormTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'reset-password');

  return {
    props: {
      _ns: await loadNamespaces(['reset-password'], locale),
      seoProps: {
        title: t('title'),
        description: t('description'),
      },
    },
  };
};

export default withUserMe(ResetPasswordPage);
