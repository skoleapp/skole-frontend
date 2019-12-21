import { Box, CardHeader, Divider } from '@material-ui/core';
import { Field, Formik, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import { NextPage } from 'next';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { authenticate } from '../../actions';
import {
  ButtonLink,
  FormSubmitSection,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm,
  TextLink
} from '../../components';
import { useSignInMutation } from '../../generated/graphql';
import { FormCompleted, SignInFormValues, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useForm, usePublicPage } from '../../utils';

const initialValues = {
  usernameOrEmail: '',
  password: '',
  general: ''
};

const validationSchema = Yup.object().shape({
  usernameOrEmail: Yup.string().required('Username or email is required.'),
  password: Yup.string().required('Password is required!')
});

const SignInPage: NextPage = () => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const { ref, setSubmitting, resetForm, onError } = useForm();

  const onCompleted = ({ signIn }: FormCompleted): void => {
    if (signIn.errors) {
      onError(signIn.errors);
    } else {
      resetForm();
      dispatch(authenticate({ client, ...signIn }));
    }
  };

  const [signInMutation] = useSignInMutation({ onCompleted, onError });

  const handleSubmit = async (values: SignInFormValues): Promise<void> => {
    const { usernameOrEmail, password } = values;
    await signInMutation({ variables: { usernameOrEmail, password } });
    setSubmitting(false);
  };

  const renderForm = (props: FormikProps<SignInFormValues>) => (
    <StyledForm>
      <Field
        placeholder="example@skole.io"
        name="usernameOrEmail"
        component={TextField}
        label="Username or Email"
        fullWidth
      />
      <Field
        placeholder="Password"
        name="password"
        component={TextField}
        label="Password"
        type="password"
        fullWidth
      />
      <FormSubmitSection submitButtonText="sign in" {...props} />
    </StyledForm>
  );

  return (
    <Layout title="Sign In" backUrl>
      <StyledCard>
        <CardHeader title="Sign In" />
        <SlimCardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            ref={ref}
          >
            {renderForm}
          </Formik>
          <Box marginTop="1rem">
            <Divider />
          </Box>
          <Box marginY="0.5rem">
            <ButtonLink href="/auth/sign-up" variant="outlined" color="primary" fullWidth>
              create account
            </ButtonLink>
          </Box>
          <TextLink href="/auth/forgot-password">Forgot password?</TextLink>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

SignInPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePublicPage(ctx);
  return {};
};

export default compose(withApollo, withRedux)(SignInPage);
