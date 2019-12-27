import { CardHeader } from '@material-ui/core';
import { Field, Formik, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import * as Yup from 'yup';
import {
  FormSubmitSection,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm
} from '../../components';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, ResetPasswordFormValues } from '../../types';
import { useForm } from '../../utils';

const initialValues = {
  password: '',
  confirmPassword: '',
  general: ''
};

const ResetPasswordPage: I18nPage = () => {
  const { ref, setSubmitting } = useForm();
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, t('validation:passwordTooShort'))
      .required(t('validation:passwordRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('validation:passwordsNotMatch'))
      .required(t('validation:confirmPasswordRequired'))
  });

  const handleSubmit = async (values: ResetPasswordFormValues): Promise<void> => {
    const { password } = values;
    console.log('Submitted!', password);
    setSubmitting(false);
  };

  const renderForm = (props: FormikProps<ResetPasswordFormValues>) => (
    <StyledForm>
      <Field
        placeholder={t('forms:password')}
        name="password"
        component={TextField}
        label={t('forms:password')}
        type="password"
        fullWidth
      />
      <Field
        placeholder={t('forms:confirmPassword')}
        name="confirmPassword"
        type="password"
        component={TextField}
        label={t('forms:confirmPassword')}
        fullWidth
      />
      <FormSubmitSection submitButtonText={t('reset-password:submitButton')} {...props} />
    </StyledForm>
  );

  return (
    <Layout title={t('reset-password:title')} backUrl>
      <StyledCard>
        <CardHeader title={t('reset-password:title')} />
        <SlimCardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            ref={ref}
          >
            {renderForm}
          </Formik>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

ResetPasswordPage.getInitialProps = (): I18nProps => {
  return {
    namespacesRequired: includeDefaultNamespaces(['reset-password', 'forms', 'validation'])
  };
};

export default compose(withApollo, withRedux)(ResetPasswordPage);
