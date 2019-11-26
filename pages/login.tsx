import { CardContent, CardHeader } from '@material-ui/core';
import { Formik } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { clientLogin } from '../actions';
import { Layout, LoginForm, StyledCard } from '../components';
import { useLoginMutation } from '../generated/graphql';
import { FormCompleted, LoginFormValues, SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useForm, usePublicPage } from '../utils';

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
  const dispatch = useDispatch();
  const { ref, setSubmitting, resetForm, onError } = useForm();

  const onCompleted = ({ login }: FormCompleted) => {
    if (login.errors) {
      onError(login.errors);
    } else {
      dispatch(clientLogin({ client, ...login }));
    }
  };

  const [loginMutation] = useLoginMutation({ onCompleted, onError });

  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    const { usernameOrEmail, password } = values;
    await loginMutation({ variables: { usernameOrEmail, password } });
    setSubmitting(false);
    resetForm();
  };
  return (
    <Layout title="Login" backUrl="/">
      <StyledCard>
        <CardHeader title="Login" />
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            component={LoginForm}
            ref={ref}
          />
        </CardContent>
      </StyledCard>
    </Layout>
  );
};

LoginPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePublicPage(ctx);
  return {};
};

export default compose(withApollo, withRedux)(LoginPage);
