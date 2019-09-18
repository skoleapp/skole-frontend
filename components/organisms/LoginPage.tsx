import { Formik, FormikActions } from 'formik';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import { LoginFormValues } from '../../interfaces';
import { login } from '../../redux';
import { loginInitialValues, loginSchema } from '../../static';
import { Anchor, H1 } from '../atoms';
import { LoginForm } from '../molecules';

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
        initialValues={loginInitialValues}
        validationSchema={loginSchema}
        onSubmit={onSubmit}
        component={LoginForm}
      />
      <Link href="/register">
        <Anchor variant="red">New user?</Anchor>
      </Link>
    </>
  );
};
