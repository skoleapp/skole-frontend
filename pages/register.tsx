import { CardContent, CardHeader } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { clientLogin } from '../actions';
import { Layout, RegisterForm, StyledCard } from '../components';
import { useRegisterMutation } from '../generated/graphql';
import { FormCompleted, RegisterFormValues, SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useForm, usePublicPage } from '../utils';

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
    'You must agree to the terms and conditions to continue',
    (value: boolean) => value === true
  )
});

const RegisterPage: NextPage = () => {
  const client = useApolloClient();
  const { ref, onError } = useForm();
  const dispatch = useDispatch();

  const onCompleted = ({ register, login }: FormCompleted) => {
    if (register.errors) {
      onError(register.errors);
    } else if (login.errors) {
      onError(login.errors);
    } else {
      dispatch(clientLogin({ client, ...login }));
    }
  };

  const [registerMutation] = useRegisterMutation({ onCompleted, onError });

  const handleSubmit = async (
    values: RegisterFormValues,
    actions: FormikActions<RegisterFormValues>
  ): Promise<void> => {
    const { username, email, password } = values;
    await registerMutation({ variables: { username, email, password } });
    actions.setSubmitting(false);
  };

  return (
    <Layout title="Register" backUrl="/">
      <StyledCard>
        <CardHeader title="Register" />
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            component={RegisterForm}
            ref={ref}
          />
        </CardContent>
      </StyledCard>
    </Layout>
  );
};

RegisterPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePublicPage(ctx);
  return {};
};

export default compose(withApollo, withRedux)(RegisterPage);
