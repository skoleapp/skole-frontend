import { Box, CardHeader } from '@material-ui/core';
import { Formik } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { clientLogin } from '../../actions';
import { Layout, LoginForm, SlimCardContent, StyledCard, TextLink } from '../../components';
import { useLoginMutation } from '../../generated/graphql';
import { FormCompleted, LoginFormValues, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useForm, usePublicPage } from '../../utils';
import { withTranslation } from '../../i18n';

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

  const onCompleted = ({ login }: FormCompleted): void => {
    if (login.errors) {
      onError(login.errors);
    } else {
      resetForm();
      dispatch(clientLogin({ client, ...login }));
    }
  };

  const [loginMutation] = useLoginMutation({ onCompleted, onError });

  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    const { usernameOrEmail, password } = values;
    await loginMutation({ variables: { usernameOrEmail, password } });
    setSubmitting(false);
  };

  return (
    <Layout title="Login" backUrl="/">
      <StyledCard>
        <CardHeader title="Login" />
        <SlimCardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            component={LoginForm}
            ref={ref}
          />
        </SlimCardContent>
        <SlimCardContent>
          <Box>
            <TextLink href="/auth/register">New user?</TextLink>
          </Box>
          <Box>
            <TextLink href="/auth/forgot-password">Forgot password?</TextLink>
          </Box>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

LoginPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePublicPage(ctx);
  return {};
};

export default compose(withRedux, withApollo, withTranslation('common'))(LoginPage);
