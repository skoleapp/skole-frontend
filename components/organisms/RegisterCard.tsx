import cookie from 'cookie';
import { Formik, FormikActions } from 'formik';
import React, { useRef } from 'react';
import { useApolloClient } from 'react-apollo';
import * as Yup from 'yup';
import { useRegisterMutation } from '../../generated/graphql';
import { RegisterFormValues } from '../../interfaces';
import { redirect } from '../../lib';
import { createFormErrors } from '../../utils';
import { Card, H1 } from '../atoms';
import { RegisterForm } from '../molecules';

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

export const RegisterCard: React.FC = () => {
  const client = useApolloClient();
  const ref = useRef<any>(); // eslint-disable-line

  // eslint-disable-next-line
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

  // eslint-disable-next-line
  const onError = (error: any) => {
    // TODO: Add logging

    const errors = createFormErrors(error);
    Object.keys(errors).forEach(key => ref.current.setFieldError(key, (errors as any)[key])); // eslint-disable-line
  };

  const [register] = useRegisterMutation({ onCompleted, onError });

  const onSubmit = async (
    values: RegisterFormValues,
    actions: FormikActions<RegisterFormValues>
  ): Promise<void> => {
    const { username, email, password } = values;

    register({
      variables: {
        username,
        email,
        password
      }
    });

    actions.setSubmitting(false);
  };

  return (
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
  );
};
