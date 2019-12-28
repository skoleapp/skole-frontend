import { CardHeader, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { ErrorMessage, Field, Formik, FormikProps } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { openNotification } from '../actions';
import {
  FormErrorMessage,
  FormSubmitSection,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm
} from '../components';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { ContactFormValues, I18nPage, I18nProps, SkoleContext } from '../types';
import { useAuthSync, useForm } from '../utils';

const initialValues = {
  contactType: '',
  email: '',
  message: '',
  general: ''
};

const ContactPage: I18nPage = () => {
  const dispatch = useDispatch();
  const { ref, resetForm } = useForm();
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    contactType: Yup.string().required(t('validation:contactTypeRequired')),
    email: Yup.string()
      .email(t('validation:invalidEmail'))
      .required(t('validation:emailRequired')),
    message: Yup.string().required(t('validation:messageRequired'))
  });

  // TODO: Finish this.
  const handleSubmit = (values: ContactFormValues): void => {
    console.log(values);
    resetForm();
    dispatch(openNotification(t('notifications:messageSubmitted')));
  };

  const renderForm = (props: FormikProps<ContactFormValues>) => (
    <StyledForm>
      <FormControl fullWidth>
        <InputLabel>{t('forms:contactType')}</InputLabel>
        <Field name="contactType" component={Select} fullWidth>
          <MenuItem value="">---</MenuItem>
          <MenuItem value="feedback">Feedback</MenuItem>
          <MenuItem value="requestSchool">{t('forms:requestSchool')}</MenuItem>
          <MenuItem value="requestSubject">{t('forms:requestSubject')}</MenuItem>
          <MenuItem value="businessInquiry">{t('forms:businessInquiry')}</MenuItem>
        </Field>
        <ErrorMessage name="contactType" component={FormErrorMessage} />
      </FormControl>
      <Field
        name="email"
        component={TextField}
        label={t('forms:email')}
        placeholder={t('forms:email')}
        fullWidth
      />
      <Field
        name="message"
        component={TextField}
        placeholder={t('forms:message')}
        label={t('forms:message')}
        fullWidth
        multiline
      />
      <FormSubmitSection submitButtonText="save" {...props} />
    </StyledForm>
  );

  return (
    <Layout title={t('contact:title')} backUrl>
      <StyledCard>
        <CardHeader title={t('contact:title')} />
        <SlimCardContent>
          <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            ref={ref}
          >
            {renderForm}
          </Formik>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

ContactPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
  await useAuthSync(ctx);

  return {
    namespacesRequired: includeDefaultNamespaces(['contact'])
  };
};

export default compose(withApollo, withRedux)(ContactPage);
