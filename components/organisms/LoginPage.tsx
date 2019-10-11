import { Formik, FormikActions } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { getApiUrl, skoleAPI } from '../../api';
import { LoginFormValues } from '../../interfaces';
import { createFormErrors, login } from '../../utils';
import { Card, H1 } from '../atoms';
import { LoginForm } from '../molecules';

export const initialValues = {
  usernameOrEmail: '',
  password: '',
  general: ''
};

export const validationSchema = Yup.object().shape({
  usernameOrEmail: Yup.string()
    .label('Username or email')
    .required('Username or email is required.'),
  password: Yup.string()
    .label('Password')
    .required('Password is required!')
});

export const LoginPage: React.FC = () => {
  const onSubmit = async (
    values: LoginFormValues,
    actions: FormikActions<LoginFormValues>
  ): Promise<void> => {
    const { usernameOrEmail, password } = values;
    const payload = { username_or_email: usernameOrEmail, password: password }; // eslint-disable-line @typescript-eslint/camelcase

    try {
      const url = getApiUrl('login');
      const { data, status } = await skoleAPI.post(url, payload);

      if (status === 200) {
        const { token } = await data;
        await login({ token });
      } else {
        const errors = await createFormErrors(data.error);
        Object.keys(errors).forEach(key => {
          actions.setFieldError(key, (errors as any)[key]);
        });
      }
    } catch (error) {
      console.log('Network error...');
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Card>
      <H1>Login</H1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        component={LoginForm}
      />
    </Card>
  );
};
