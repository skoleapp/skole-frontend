import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import React, { useRef } from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { clientLogin } from '../actions';
import { StyledCard } from '../components';
import { Layout, RegisterForm } from '../containers';
import { useRegisterMutation } from '../generated/graphql';
import { RegisterFormValues, SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { createFormErrors, usePublicPage } from '../utils';

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
  const ref = useRef<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch();

  // eslint-disable-next-line
  const onCompleted = ({ register, login }: any) => {
    if (register.errors) {
      onError(register.errors); // eslint-disable-line @typescript-eslint/no-use-before-define
    } else if (login.errors) {
      onError(login.errors);
    } else {
      dispatch(clientLogin({ client, ...login }));
    }
  };

  // eslint-disable-next-line
  const onError = (errors: any) => {
    const formErrors = createFormErrors(errors);
    Object.keys(formErrors).forEach(
      key => ref.current.setFieldError(key, (formErrors as any)[key]) // eslint-disable-line @typescript-eslint/no-explicit-any
    );
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
    <Layout heading="Register" title="Register" backUrl="/">
      <StyledCard>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          component={RegisterForm}
          ref={ref}
        />
      </StyledCard>
    </Layout>
  );
};

RegisterPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePublicPage(ctx);
  return {};
};

export default compose(withApollo, withRedux)(RegisterPage);
