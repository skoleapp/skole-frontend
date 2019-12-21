import { Box, CardHeader, Divider, FormControl, Link, Typography } from '@material-ui/core';
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
  FormSubmitSection,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm,
  TextLink
} from '../../components';
import { useSignUpMutation } from '../../generated/graphql';
import { FormCompleted, SignUpFormValues, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useForm, usePublicPage } from '../../utils';

const initialValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
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
    .required('Confirm password is required.')
});

const SignUpPage: NextPage = () => {
  const client = useApolloClient();
  const { ref, resetForm, setSubmitting, onError } = useForm();
  const dispatch = useDispatch();

  const onCompleted = ({ signUp, signIn }: FormCompleted): void => {
    if (signUp.errors) {
      onError(signUp.errors);
    } else if (signIn.errors) {
      onError(signIn.errors);
    } else {
      resetForm();
      dispatch(authenticate({ client, ...signIn }));
    }
  };

  const [signUpMutation] = useSignUpMutation({ onCompleted, onError });

  const handleSubmit = async (values: SignUpFormValues): Promise<void> => {
    const { username, email, password } = values;
    await signUpMutation({ variables: { username, email, password } });
    setSubmitting(false);
  };

  const renderForm = (props: FormikProps<SignUpFormValues>) => (
    <StyledForm>
      <Field
        placeholder="Username"
        name="username"
        component={TextField}
        label="Username"
        fullWidth
      />
      <Field
        placeholder="example@skole.io"
        name="email"
        component={TextField}
        label="Email"
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
      <Field
        placeholder="Confirm password"
        name="confirmPassword"
        type="password"
        component={TextField}
        label="Confirm Password"
        fullWidth
      />
      <FormControl fullWidth>
        <Box marginTop="0.5rem">
          <Typography variant="body2" color="textSecondary">
            By signing up you agree to our{' '}
            <Link href="/terms" target="_blank">
              Terms
            </Link>
            .
          </Typography>
        </Box>
      </FormControl>
      <FormSubmitSection submitButtonText="sign up" {...props} />
    </StyledForm>
  );

  return (
    <Layout title="Sign Up" backUrl>
      <StyledCard>
        <CardHeader title="Sign Up" />
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
          <Box marginTop="0.5rem">
            <TextLink href="/auth/sign-in">Already have an account?</TextLink>
          </Box>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

SignUpPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePublicPage(ctx);
  return {};
};

export default compose(withApollo, withRedux)(SignUpPage);
