import { FormControl } from '@material-ui/core';
import { ButtonLink, FormSubmitSection, SettingsTemplate, TextFormField } from 'components';
import { useNotificationsContext, useConfirmContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import { DeleteUserMutation, useDeleteUserMutation } from 'generated';
import { withAuth } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router from 'next/router';
import React from 'react';
import { urls } from 'utils';
import * as Yup from 'yup';

const initialValues = {
  password: '',
  general: '',
};

export interface DeleteAccountFormValues {
  password: string;
}

export const DeleteAccountPage: NextPage = () => {
  const {
    formRef,
    setSubmitting,
    resetForm,
    handleMutationErrors,
    onError,
    unexpectedError,
  } = useForm<DeleteAccountFormValues>();

  const { t } = useTranslation();
  const { confirm } = useConfirmContext();
  const context = useLanguageHeaderContext();
  const { toggleNotification } = useNotificationsContext();

  const onCompleted = async ({ deleteUser }: DeleteUserMutation): Promise<void> => {
    if (deleteUser) {
      if (!!deleteUser.errors && !!deleteUser.errors.length) {
        handleMutationErrors(deleteUser.errors);
      } else if (deleteUser.successMessage) {
        resetForm();
        toggleNotification(deleteUser.successMessage);
        localStorage.removeItem('user');
        await Router.push(urls.logout);
      } else {
        unexpectedError();
      }
    } else {
      unexpectedError();
    }
  };

  const [deleteUser] = useDeleteUserMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmit = async (values: DeleteAccountFormValues): Promise<void> => {
    setSubmitting(false);

    try {
      await confirm({
        title: t('delete-account:confirmDeleteHeader'),
        description: t('delete-account:confirmDeleteText'),
      });

      await deleteUser({ variables: { password: values.password } });
    } catch {
      // User cancelled.
    } finally {
      setSubmitting(true);
    }
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string().required(t('validation:required')),
  });

  const renderPasswordField = (
    <Field name="password" label={t('forms:password')} component={TextFormField} type="password" />
  );

  const renderFormSubmitSection = (props: FormikProps<DeleteAccountFormValues>): JSX.Element => (
    <FormSubmitSection submitButtonText={t('common:confirm')} {...props} />
  );

  const renderCancelButton = (
    <FormControl>
      <ButtonLink href={urls.editProfile} variant="outlined" color="primary">
        {t('common:cancel')}
      </ButtonLink>
    </FormControl>
  );

  const renderFormFields = (props: FormikProps<DeleteAccountFormValues>): JSX.Element => (
    <Form>
      {renderPasswordField}
      {renderFormSubmitSection(props)}
      {renderCancelButton}
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
      title: t('delete-account:title'),
      description: t('delete-account:description'),
    },
    header: t('delete-account:header'),
    topNavbarProps: {
      dynamicBackUrl: true,
    },
  };

  return <SettingsTemplate {...layoutProps}>{renderForm}</SettingsTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['delete-account'], locale),
  },
});

export default withAuth(DeleteAccountPage);
