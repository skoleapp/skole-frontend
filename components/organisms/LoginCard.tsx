import cookie from 'cookie';
import { Formik, FormikActions } from 'formik';
import Router from 'next/router';
import React, { useRef } from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useLoginMutation } from '../../generated/graphql';
import { LoginFormValues } from '../../interfaces';
import { setUser } from '../../redux/actions/auth';
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
  const dispatch = useDispatch();

  // eslint-disable-next-line
  const onCompleted = (data: any) => {
    // Store the token in cookie.
    document.cookie = cookie.serialize('token', data.login.token, {
      sameSite: true,
      path: '/',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });
    // Set user.
    dispatch(setUser(data.login.user));
  };

  // eslint-disable-next-line
  const onError = (errors: any) => {
    const formErrors = createFormErrors(errors);
    Object.keys(formErrors).forEach(key => ref.current.setFieldError(key, (errors as any)[key])); // eslint-disable-line
  };

  const [login] = useLoginMutation({ onCompleted, onError });

  const onSubmit = (values: LoginFormValues, actions: FormikActions<LoginFormValues>): void => {
    const { email, password } = values;
    login({ variables: { email, password } });
    actions.setSubmitting(false);
    // Force a reload of all the current queries now that the user is logged in.
    client.cache.reset().then(() => {
      Router.push('/');
    });
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
