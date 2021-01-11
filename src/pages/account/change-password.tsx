import {
  FormSubmitSection,
  LoginRequiredTemplate,
  SettingsTemplate,
  TextFormField,
} from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import { ChangePasswordMutation, useChangePasswordMutation } from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import * as Yup from 'yup';
import { PASSWORD_MIN_LENGTH } from 'utils';

const initialValues = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
  general: '',
};

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
  } = useForm<ChangePasswordFormValues>();

  const { toggleNotification } = useNotificationsContext();
  const { userMe } = useAuthContext();
  const context = useLanguageHeaderContext();
  const { t } = useTranslation();

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
    if (changePassword) {
      if (!!changePassword.errors && !!changePassword.errors.length) {
        handleMutationErrors(changePassword.errors);
      } else if (changePassword.successMessage) {
        formRef.current?.resetForm();
        toggleNotification(changePassword.successMessage);
      } else {
        setUnexpectedFormError();
      }
    }
  };

  const [changePassword] = useChangePasswordMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmit = async ({
    oldPassword,
    newPassword,
  }: ChangePasswordFormValues): Promise<void> => {
    await changePassword({ variables: { oldPassword, newPassword } });
  };

  const renderFormFields = (props: FormikProps<ChangePasswordFormValues>): JSX.Element => (
    <Form>
      <Field
        name="oldPassword"
        component={TextFormField}
        label={t('forms:oldPassword')}
        type="password"
      />
      <Field
        name="newPassword"
        component={TextFormField}
        label={t('forms:newPassword')}
        type="password"
      />
      <Field
        name="confirmNewPassword"
        component={TextFormField}
        label={t('forms:confirmNewPassword')}
        type="password"
      />
      <FormSubmitSection submitButtonText={t('common:save')} {...props} />
    </Form>
  );

  const renderForm = (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
      innerRef={formRef}
    >
      {renderFormFields}
    </Formik>
  );

  const layoutProps = {
    seoProps: {
      title: t('change-password:title'),
    },
    header: t('change-password:header'),
    topNavbarProps: {
      dynamicBackUrl: true,
    },
  };

  if (!userMe) {
    return <LoginRequiredTemplate {...layoutProps} />;
  }

  return <SettingsTemplate {...layoutProps}>{renderForm}</SettingsTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['change-password'], locale),
  },
});

export default withUserMe(ChangePasswordPage);
