import cookie from 'cookie';
import { Formik, FormikActions } from 'formik';
import gql from 'graphql-tag';
import { NextPage } from 'next';
import React, { useRef } from 'react';
import { useApolloClient, useMutation } from 'react-apollo';
import * as Yup from 'yup';
import { Card, H1, MainLayout, RegisterForm } from '../components';
import { RegisterFormValues } from '../interfaces';
import { withApollo } from '../lib';
import { checkLoggedIn, createFormErrors, redirect } from '../utils';

const REGISTER = gql`
  mutation Register($input: RegisterMutationInput!, $email: String!, $password: String!) {
    register(input: $input) {
      id
    }
    login(email: $email, password: $password) {
      token
    }
  }
`;

const initialValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
  general: ''
};

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required.'),
  email: Yup.string()
    .email('Invalid email.')
    .required('Email is required.'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long.')
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match.')
    .required('Confirm password is required.'),
  agreeToTerms: Yup.boolean().test(
    'is-true',
    'You must agree to terms to continue',
    (value: boolean) => value === true
  )
});

const RegisterPage: NextPage = () => {
  const client = useApolloClient();
  const ref = useRef<any>();

  const onCompleted = (data: any) => {
    // Store the token in cookie
    document.cookie = cookie.serialize('token', data.signinUser.token, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/' // make cookie available for all routes underneath "/"
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

  const [register] = useMutation(REGISTER, { onCompleted, onError });

  const onSubmit = async (
    values: RegisterFormValues,
    actions: FormikActions<RegisterFormValues>
  ): Promise<void> => {
    const { username, email, password } = values;

    register({
      variables: {
        input: {
          username,
          email,
          password
        }
      }
    });

    actions.setSubmitting(false);
  };

  return (
    <MainLayout title="Register">
      <Card>
        <H1>Register</H1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          component={RegisterForm}
          ref={ref}
        />
      </Card>
    </MainLayout>
  );
};

RegisterPage.getInitialProps = async (context: any): Promise<{}> => {
  const { loggedInUser } = await checkLoggedIn(context.apolloClient);

  if (loggedInUser.user) {
    redirect(context, '/');
  }

  return {};
};

export default withApollo(RegisterPage);
