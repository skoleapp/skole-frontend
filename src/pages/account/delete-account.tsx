import FormControl from '@material-ui/core/FormControl';
import {
  ButtonLink,
  FormSubmitSection,
  LoginRequiredTemplate,
  SettingsTemplate,
  TextFormField,
} from 'components';
import { useAuthContext, useConfirmContext, useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import { DeleteUserMutation, useDeleteUserMutation } from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router from 'next/router';
import React from 'react';
import { SeoPageProps } from 'types';
import { urls } from 'utils';
import * as Yup from 'yup';

const initialValues = {
  password: '',
  general: '',
};

export interface DeleteAccountFormValues {
  password: string;
}

export const DeleteAccountPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const {
    formRef,
    handleMutationErrors,
    onError,
    setUnexpectedFormError,
  } = useForm<DeleteAccountFormValues>();

  const { t } = useTranslation();
  const { confirm } = useConfirmContext();
  const { userMe } = useAuthContext();
  const context = useLanguageHeaderContext();
  const { toggleNotification } = useNotificationsContext();

  const onCompleted = async ({ deleteUser }: DeleteUserMutation): Promise<void> => {
    if (deleteUser) {
      if (!!deleteUser.errors && !!deleteUser.errors.length) {
        handleMutationErrors(deleteUser.errors);
      } else if (deleteUser.successMessage) {
        formRef.current?.resetForm();
        toggleNotification(deleteUser.successMessage);
        localStorage.removeItem('user');
        await Router.push(urls.logout);
        sa_event('delete_account');
      } else {
        setUnexpectedFormError();
      }
    } else {
      setUnexpectedFormError();
    }
  };

  const [deleteUser] = useDeleteUserMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmit = async (values: DeleteAccountFormValues): Promise<void> => {
    const { setSubmitting } = formRef.current!;
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
      setSubmitting(false);
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
      <ButtonLink href={urls.editProfile} variant="outlined">
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
    seoProps,
    topNavbarProps: {
      header: t('delete-account:header'),
      emoji: '⚠️',
    },
  };

  if (!userMe) {
    return <LoginRequiredTemplate {...layoutProps} />;
  }

  return <SettingsTemplate {...layoutProps}>{renderForm}</SettingsTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'delete-account');

  return {
    props: {
      _ns: await loadNamespaces(['delete-account'], locale),
      seoProps: {
        title: t('title'),
      },
    },
  };
};

export default withUserMe(DeleteAccountPage);
