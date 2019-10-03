import { Formik, FormikActions } from 'formik';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { LoginFormValues } from '../../interfaces';
import { login } from '../../redux';
import { Anchor, H1 } from '../atoms';
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
  const dispatch = useDispatch();

  const onSubmit = async (
    values: LoginFormValues,
    actions: FormikActions<LoginFormValues>
  ): Promise<void> => {
    try {
      await dispatch(login(values));
      Router.push('/account');
    } catch (error) {
      const { payload } = error;
      Object.keys(payload).forEach(key => {
        actions.setFieldError(key, payload[key]);
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <>
      <H1>Login</H1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        component={LoginForm}
      />
      <Link href="/register">
        <Anchor variant="red">New user?</Anchor>
      </Link>
    </>
  );
};
