import { BackButton, FormSubmitSection, FormTemplate, TextFormField } from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import { CreateContactMessageMutation, useCreateContactMessageMutation } from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import * as Yup from 'yup';

const initialValues = {
  subject: '',
  name: '',
  email: '',
  message: '',
  general: '',
};

interface ContactFormValues {
  subject: string;
  name: string;
  email: string;
  message: string;
}

const ContactPage: NextPage = () => {
  const { t } = useTranslation();
  const context = useLanguageHeaderContext();
  const { toggleNotification } = useNotificationsContext();

  const {
    formRef,
    onError,
    handleMutationErrors,
    setUnexpectedFormError,
  } = useForm<ContactFormValues>();

  const validationSchema = Yup.object().shape({
    subject: Yup.string().required(t('validation:required')),
    name: Yup.string(),
    email: Yup.string().email(t('validation:invalidEmail')).required(t('validation:required')),
    message: Yup.string().required(t('validation:required')),
  });

  const onCompleted = ({ createContactMessage }: CreateContactMessageMutation): void => {
    if (createContactMessage) {
      if (!!createContactMessage.errors && !!createContactMessage.errors.length) {
        handleMutationErrors(createContactMessage.errors);
      } else if (createContactMessage.successMessage) {
        formRef.current?.resetForm();
        toggleNotification(createContactMessage.successMessage);
      } else {
        setUnexpectedFormError();
      }
    } else {
      setUnexpectedFormError();
    }
  };

  const [createContactMessage] = useCreateContactMessageMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmit = async (values: ContactFormValues): Promise<void> => {
    const { subject, name, email, message } = values;

    const variables = {
      subject,
      name,
      email,
      message,
    };

    await createContactMessage({ variables });
  };

  const renderFormFields = (props: FormikProps<ContactFormValues>): JSX.Element => (
    <Form>
      <Field name="subject" component={TextFormField} label={t('forms:messageSubject')} />
      <Field name="name" component={TextFormField} label={t('forms:nameOptional')} />
      <Field name="email" component={TextFormField} label={t('forms:email')} />
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
    >
      {renderFormFields}
    </Formik>
  );

  const layoutProps = {
    seoProps: {
      title: t('contact:title'),
      description: t('contact:description'),
    },
    topNavbarProps: {
      renderBackButton: <BackButton />,
      header: t('contact:header'),
    },
  };

  return <FormTemplate {...layoutProps}>{renderForm}</FormTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['contact'], locale),
  },
});

export default withUserMe(ContactPage);
