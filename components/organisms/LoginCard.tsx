import cookie from 'cookie';
import { Formik, FormikActions } from 'formik';
import React, { useRef } from 'react';
import { useApolloClient } from 'react-apollo';
import * as Yup from 'yup';
import { useLoginMutation } from '../../generated/graphql';
import { LoginFormValues } from '../../interfaces';
import { redirect } from '../../lib';
import { createFormErrors } from '../../utils';
import { Card, H1 } from '../atoms';
import { LoginForm } from '../molecules';

const initialValues = {
  email: '',
  password: '',
  general: ''
};

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required.'),
  password: Yup.string().required('Password is required!')
});

export const LoginCard: React.FC = () => {
  const client = useApolloClient();
  const ref = useRef<any>(); // eslint-disable-line

  // eslint-disable-next-line
  const onCompleted = (data: any) => {
    // Store the token in cookie
    document.cookie = cookie.serialize('token', data.login.token, {
      sameSite: true,
      path: '/',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });
    // Force a reload of all the current queries now that the user is
    // logged in
    client.cache.reset().then(() => {
      redirect({}, '/');
    });
  };

  // eslint-disable-next-line
  const onError = (error: any) => {
    // TODO: Add logging

    const errors = createFormErrors(error);
    Object.keys(errors).forEach(key => ref.current.setFieldError(key, (errors as any)[key]));
  };

  const [login] = useLoginMutation({ onCompleted, onError });

  const onSubmit = (values: LoginFormValues, actions: FormikActions<LoginFormValues>): void => {
    const { email, password } = values;

    login({
      variables: {
        email,
        password
      }
    });

    actions.setSubmitting(false);
  };

  return (
    <Card>
      <H1>Login</H1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        component={LoginForm}
        ref={ref}
      />
    </Card>
  );
};
