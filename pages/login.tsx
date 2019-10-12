import cookie from 'cookie';
import { Formik, FormikActions } from 'formik';
import gql from 'graphql-tag';
import { NextPage } from 'next';
import React, { useRef } from 'react';
import { useApolloClient, useMutation } from 'react-apollo';
import * as Yup from 'yup';
import { Card, H1, LoginForm, MainLayout } from '../components';
import { LoginFormValues } from '../interfaces';
import { withApollo } from '../lib';
import { checkLoggedIn, createFormErrors, redirect } from '../utils';

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const initialValues = {
  email: '',
  password: '',
  general: ''
};

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required.'),
  password: Yup.string().required('Password is required!')
});

const LoginPage: NextPage = () => {
  const client = useApolloClient();
  const ref = useRef<any>();

  const onCompleted = (data: any) => {
    console.log(data);
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

  const onError = (error: any) => {
    // TODO: Add logging

    const errors = createFormErrors(error);
    Object.keys(errors).forEach(key => ref.current.setFieldError(key, (errors as any)[key]));
  };

  const [login] = useMutation(LOGIN, {
    onCompleted,
    onError
  });

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
    <MainLayout title="Login">
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
    </MainLayout>
  );
};

LoginPage.getInitialProps = async (context: any): Promise<{}> => {
  const { loggedInUser } = await checkLoggedIn(context.apolloClient);
  if (loggedInUser.user) {
    redirect(context, '/');
  }

  return {};
};

export default withApollo(LoginPage);
