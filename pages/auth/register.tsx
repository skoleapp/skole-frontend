import { CardHeader } from '@material-ui/core';
import { Formik } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { clientLogin } from '../../actions';
import { Layout, RegisterForm, SlimCardContent, StyledCard, TextLink } from '../../components';
import { useRegisterMutation } from '../../generated/graphql';
import { FormCompleted, RegisterFormValues, SkoleContext } from '../../interfaces';
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

const RegisterPage: NextPage = () => {
  const client = useApolloClient();
  const { ref, resetForm, setSubmitting, onError } = useForm();
  const dispatch = useDispatch();

  const onCompleted = ({ register, login }: FormCompleted): void => {
    if (register.errors) {
      onError(register.errors);
    } else if (login.errors) {
      onError(login.errors);
    } else {
      resetForm();
      dispatch(clientLogin({ client, ...login }));
    }
  };

  const [registerMutation] = useRegisterMutation({ onCompleted, onError });

  const handleSubmit = async (values: RegisterFormValues): Promise<void> => {
    const { username, email, password } = values;
    await registerMutation({ variables: { username, email, password } });
    setSubmitting(false);
  };

  return (
    <Layout title="Register" backUrl="/">
      <StyledCard>
        <CardHeader title="Register" />
        <SlimCardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            component={RegisterForm}
            ref={ref}
          />
        </SlimCardContent>
        <SlimCardContent>
          <TextLink href="/auth/login">Already a user?</TextLink>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

RegisterPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePublicPage(ctx);
  return {};
};

export default compose(withApollo, withRedux)(RegisterPage);
