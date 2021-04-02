import { FormSubmitSection, FormTemplate, PasswordField } from 'components';
import { useNotificationsContext } from 'context';
import { Form, Formik, FormikProps } from 'formik';
import { ChangePasswordMutation, useChangePasswordMutation } from 'generated';
import { withAuthRequired } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React, { useCallback, useMemo } from 'react';
import { PASSWORD_MIN_LENGTH } from 'utils';
import * as Yup from 'yup';

interface ChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ChangePasswordPage: NextPage = () => {
  const {
    formRef,
    handleMutationErrors,
    onError,
    setUnexpectedFormError,
    generalFormValues,
  } = useForm<ChangePasswordFormValues>();

  const { toggleNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();
  const { t } = useTranslation();

  const initialValues = useMemo(
    () => ({
      ...generalFormValues,
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }),
    [generalFormValues],
  );

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required(t('validation:required')),
    newPassword: Yup.string()
      .min(PASSWORD_MIN_LENGTH, t('validation:passwordTooShort', { length: PASSWORD_MIN_LENGTH }))
      .required(t('validation:required')),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), ''], t('validation:passwordsNotMatch'))
      .required(t('validation:required')),
  });

  const onCompleted = async ({ changePassword }: ChangePasswordMutation): Promise<void> => {
    if (changePassword?.errors?.length) {
      handleMutationErrors(changePassword.errors);
    } else if (changePassword?.successMessage) {
      formRef.current?.resetForm();
      toggleNotification(changePassword.successMessage);
    } else {
      setUnexpectedFormError();
    }
  };

  const [changePassword] = useChangePasswordMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmit = useCallback(
    async ({ oldPassword, newPassword }: ChangePasswordFormValues): Promise<void> => {
      await changePassword({ variables: { oldPassword, newPassword } });
    },
    [changePassword],
  );

  const renderFormFields = useCallback(
    (props: FormikProps<ChangePasswordFormValues>): JSX.Element => (
      <Form>
        <PasswordField name="oldPassword" label={t('forms:oldPassword')} {...props} />
        <PasswordField name="newPassword" label={t('forms:newPassword')} {...props} />
        <PasswordField name="confirmNewPassword" label={t('forms:confirmNewPassword')} {...props} />
        <FormSubmitSection submitButtonText={t('common:save')} {...props} />
      </Form>
    ),
    [t],
  );

  const renderForm = useMemo(
    () => (
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
        innerRef={formRef}
      >
        {renderFormFields}
      </Formik>
    ),
    [formRef, handleSubmit, initialValues, renderFormFields, validationSchema],
  );

  const layoutProps = {
    seoProps: {
      title: t('change-password:title'),
    },
    topNavbarProps: {
      header: t('change-password:header'),
      emoji: '🔑',
    },
  };

  return <FormTemplate {...layoutProps}>{renderForm}</FormTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['change-password'], locale),
  },
});

export default withAuthRequired(ChangePasswordPage);
