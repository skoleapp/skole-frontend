import { FormSubmitSection, FormTemplate, TextFormField } from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import { CreateContactMessageMutation, useCreateContactMessageMutation } from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React, { useMemo } from 'react';
import { ContactFormValues } from 'types';
import * as Yup from 'yup';

const ContactPage: NextPage = () => {
  const { t } = useTranslation();
  const context = useLanguageHeaderContext();
  const { toggleNotification } = useNotificationsContext();
  const { userMe, email } = useAuthContext();

  const {
    formRef,
    onError,
    handleMutationErrors,
    setUnexpectedFormError,
    generalFormValues,
  } = useForm<ContactFormValues>();

  const validationSchema = Yup.object().shape({
    subject: Yup.string(),
    name: Yup.string(),
    email: Yup.string().email(t('validation:invalidEmail')),
    message: Yup.string().required(t('validation:required')),
  });

  const onCompleted = ({ createContactMessage }: CreateContactMessageMutation): void => {
    if (createContactMessage?.errors?.length) {
      handleMutationErrors(createContactMessage.errors);
    } else if (createContactMessage?.successMessage) {
      formRef.current?.resetForm();
      toggleNotification(createContactMessage.successMessage);
    } else {
      setUnexpectedFormError();
    }
  };

  const [createContactMessage] = useCreateContactMessageMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmit = async ({
    subject,
    name,
    email,
    message,
  }: ContactFormValues): Promise<void> => {
    const variables = {
      subject,
      name,
      email,
      message,
    };

    await createContactMessage({ variables });
  };

  const initialValues = useMemo(
    () => ({
      ...generalFormValues,
      subject: '',
      name: '',
      email,
      message: '',
    }),
    [email, generalFormValues],
  );

  const renderFormFields = (props: FormikProps<ContactFormValues>): JSX.Element => (
    <Form>
      <Field name="subject" component={TextFormField} label={t('forms:subjectOptional')} />
      <Field name="name" component={TextFormField} label={t('forms:nameOptional')} />
      <Field name="email" component={TextFormField} label={t('forms:emailOptional')} />
      <Field
        name="message"
        component={TextFormField}
        label={t('forms:message')}
        rows="4"
        multiline
      />
      <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
    </Form>
  );

  const renderForm = (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
      innerRef={formRef}
      enableReinitialize
    >
      {renderFormFields}
    </Formik>
  );

  const layoutProps = {
    seoProps: {
      title: t('contact:title'),
    },
    topNavbarProps: {
      header: t('contact:header'),
      emoji: '🗣️',
    },
    hideBottomNavbar: !userMe,
  };

  return <FormTemplate {...layoutProps}>{renderForm}</FormTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['contact'], locale),
  },
});

export default withUserMe(ContactPage);
