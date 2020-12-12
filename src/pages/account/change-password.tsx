import { FormSubmitSection, SettingsTemplate, TextFormField } from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik } from 'formik';
import { ChangePasswordMutation, useChangePasswordMutation } from 'generated';
import { withAuth } from 'hocs';
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
    resetForm,
    handleMutationErrors,
    onError,
    unexpectedError,
  } = useForm<ChangePasswordFormValues>();

  const { toggleNotification } = useNotificationsContext();
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
        resetForm();
        toggleNotification(changePassword.successMessage);
      } else {
        unexpectedError();
      }
    }
  };

  const [changePassword] = useChangePasswordMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmit = async (values: ChangePasswordFormValues): Promise<void> => {
    const { oldPassword, newPassword } = values;
    await changePassword({ variables: { oldPassword, newPassword } });
  };

  const renderForm = (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
      innerRef={formRef}
    >
      {(props): JSX.Element => (
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
      )}
    </Formik>
  );

  const layoutProps = {
    seoProps: {
      title: t('change-password:title'),
      description: t('change-password:description'),
    },
    header: t('change-password:header'),
    form: true,
    topNavbarProps: {
      dynamicBackUrl: true,
    },
  };

  return <SettingsTemplate {...layoutProps}>{renderForm}</SettingsTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['change-password'], locale),
  },
});

export default withAuth(ChangePasswordPage);
