import { Typography } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import React, { useRef } from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { clientLogin } from '../actions';
import { StyledCard } from '../components';
import { Layout, LoginForm } from '../containers';
import { useLoginMutation } from '../generated/graphql';
import { LoginFormValues } from '../interfaces';
import { createFormErrors, withPublic } from '../utils';

const initialValues = {
  usernameOrEmail: '',
  password: '',
  general: ''
};

const validationSchema = Yup.object().shape({
  usernameOrEmail: Yup.string().required('Username or email is required.'),
  password: Yup.string().required('Password is required!')
});

const LoginPage: NextPage = () => {
  const client = useApolloClient();
  const ref = useRef<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch();

  // eslint-disable-next-line
  const onCompleted = ({ login }: any) => {
    if (login.errors) {
      return onError(login.errors);
    }

    dispatch(clientLogin({ client, ...login }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (errors: any): void => {
    const formErrors = createFormErrors(errors);
    Object.keys(formErrors).forEach(
      key => ref.current.setFieldError(key, (formErrors as any)[key]) // eslint-disable-line @typescript-eslint/no-explicit-any
    );
  };

  const [loginMutation] = useLoginMutation({ onCompleted, onError });

  const handleSubmit = async (
    values: LoginFormValues,
    actions: FormikActions<LoginFormValues>
  ): Promise<void> => {
    const { usernameOrEmail, password } = values;
    await loginMutation({ variables: { usernameOrEmail, password } });
    actions.setSubmitting(false);
  };
  return (
    <Layout title="Login">
      <StyledCard>
        <Typography variant="h5">Login</Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          component={LoginForm}
          ref={ref}
        />
      </StyledCard>
    </Layout>
  );
};

export default withPublic(LoginPage);
