import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import {
  ActionRequiredTemplate,
  FormSubmitSection,
  FormTemplate,
  PasswordField,
  TextFormField,
} from 'components';
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
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import { PASSWORD_MIN_LENGTH, urls } from 'utils';
import * as Yup from 'yup';

interface EmailFormValues {
  email: string;
}

interface PasswordFormValues {
  newPassword: string;
  confirmNewPassword: string;
}

const ResetPasswordPage: NextPage = () => {
  const {
    formRef: emailFormRef,
    handleMutationErrors: handleEmailFormMutationErrors,
    onError: onEmailFormError,
    setUnexpectedFormError: emailFormUnexpectedError,
    generalFormValues: generalEmailFormValues,
  } = useForm<EmailFormValues>();

  const {
    formRef: passwordFormRef,
    handleMutationErrors: handlePasswordFormMutationErrors,
    onError: onPasswordFormError,
    setUnexpectedFormError: passwordFormUnexpectedError,
    generalFormValues: generalPasswordFormValues,
  } = useForm<PasswordFormValues>();

  const { query } = useRouter();
  const { t } = useTranslation();
  const { userMe } = useAuthContext();
  const token = query.token ? String(query.token) : '';
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const { toggleNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();

  const emailFormInitialValues = useMemo(
    () => ({
      ...generalEmailFormValues,
      email: '',
    }),
    [generalEmailFormValues],
  );

  const emailValidationSchema = Yup.object().shape({
    email: Yup.string().email(t('validation:invalidEmail')).required(t('validation:required')),
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

  const passwordFormInitialValues = useMemo(
    () => ({
      ...generalPasswordFormValues,
      newPassword: '',
      confirmNewPassword: '',
    }),
    [generalPasswordFormValues],
  );

  const passwordValidationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(PASSWORD_MIN_LENGTH, t('validation:passwordTooShort', { length: PASSWORD_MIN_LENGTH }))
      .required(t('validation:required')),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), ''], t('validation:passwordsNotMatch'))
      .required(t('validation:required')),
  });

  const onPasswordFormCompleted = async ({
    resetPassword,
  }: ResetPasswordMutation): Promise<void> => {
    if (resetPassword?.errors?.length) {
      handlePasswordFormMutationErrors(resetPassword.errors);
    } else if (resetPassword?.successMessage) {
      passwordFormRef.current?.resetForm();
      toggleNotification(resetPassword.successMessage);
      await Router.push(urls.login);
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

  const handleSubmitEmail = useCallback(
    async (values: EmailFormValues): Promise<void> => {
      const { email } = values;
      await sendPasswordResetEmail({ variables: { email } });
    },
    [sendPasswordResetEmail],
  );

  const handleSubmitPassword = useCallback(
    async (values: PasswordFormValues): Promise<void> => {
      const { newPassword } = values;
      await resetPassword({ variables: { newPassword, token } });
    },
    [resetPassword, token],
  );

  const renderNewPasswordField = useCallback(
    (props: FormikProps<PasswordFormValues>) => (
      <PasswordField name="newPassword" label={t('forms:newPassword')} {...props} />
    ),
    [t],
  );

  const renderConfirmNewPasswordField = useCallback(
    (props: FormikProps<PasswordFormValues>) => (
      <PasswordField name="confirmNewPassword" label={t('forms:confirmNewPassword')} {...props} />
    ),
    [t],
  );

  const renderFormSubmitSection = useCallback(
    <T extends PasswordFormValues | EmailFormValues>(props: FormikProps<T>): JSX.Element => (
      <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
    ),
    [t],
  );

  const renderPasswordFormFields = useCallback(
    (props: FormikProps<PasswordFormValues>): JSX.Element => (
      <Form>
        {renderNewPasswordField(props)}
        {renderConfirmNewPasswordField(props)}
        {renderFormSubmitSection(props)}
      </Form>
    ),
    [renderConfirmNewPasswordField, renderFormSubmitSection, renderNewPasswordField],
  );

  const renderPasswordForm = useMemo(
    () =>
      !!token && (
        <Formik
          initialValues={passwordFormInitialValues}
          validationSchema={passwordValidationSchema}
          onSubmit={handleSubmitPassword}
          innerRef={passwordFormRef}
          enableReinitialize
        >
          {renderPasswordFormFields}
        </Formik>
      ),
    [
      handleSubmitPassword,
      passwordFormInitialValues,
      passwordFormRef,
      passwordValidationSchema,
      renderPasswordFormFields,
      token,
    ],
  );

  const renderEmailField = useMemo(
    () => (
      <Field
        name="email"
        component={TextFormField}
        label={t('forms:email')}
        helperText={t('reset-password:helpText')}
      />
    ),
    [t],
  );

  const renderEmailFormFields = useMemo(
    () => (props: FormikProps<EmailFormValues>): JSX.Element => (
      <Form>
        {renderEmailField}
        {renderFormSubmitSection<EmailFormValues>(props)}
      </Form>
    ),
    [renderEmailField, renderFormSubmitSection],
  );

  const renderEmailForm = useMemo(
    () =>
      !token &&
      !emailSubmitted && (
        <Formik
          initialValues={emailFormInitialValues}
          validationSchema={emailValidationSchema}
          onSubmit={handleSubmitEmail}
          innerRef={emailFormRef}
          enableReinitialize
        >
          {renderEmailFormFields}
        </Formik>
      ),
    [
      emailFormInitialValues,
      emailFormRef,
      emailSubmitted,
      emailValidationSchema,
      handleSubmitEmail,
      renderEmailFormFields,
      token,
    ],
  );

  const renderEmailSubmitted = useMemo(
    () =>
      !token &&
      emailSubmitted && (
        <FormControl>
          <Typography variant="subtitle1" align="center">
            {t('reset-password:emailSubmitted')}
          </Typography>
        </FormControl>
      ),
    [emailSubmitted, t, token],
  );

  const layoutProps = {
    seoProps: {
      title: t('reset-password:title'),
    },
    topNavbarProps: {
      header: t('reset-password:header'),
      emoji: '😶‍🌫️',
    },
  };

  if (userMe) {
    return <ActionRequiredTemplate variant="logout" {...layoutProps} />;
  }

  return (
    <FormTemplate {...layoutProps}>
      {renderPasswordForm}
      {renderEmailForm}
      {renderEmailSubmitted}
    </FormTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['reset-password'], locale),
  },
});

export default withUserMe(ResetPasswordPage);
