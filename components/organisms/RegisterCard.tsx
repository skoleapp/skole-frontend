import { Formik, FormikActions } from 'formik';
import React, { useRef } from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { login } from '../../actions';
import { useRegisterMutation } from '../../generated/graphql';
import { RegisterFormValues } from '../../interfaces';
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
    'You must agree to the terms and conditions to continue',
    (value: boolean) => value === true
  )
});

export const RegisterCard: React.FC = () => {
  const client = useApolloClient();
  const ref = useRef<any>(); // eslint-disable-line
  const dispatch = useDispatch();

  // eslint-disable-next-line
  const onCompleted = (data: any) => {
    if (data.register.errors) {
      return onError(data.register.errors);
    }

    dispatch(login({ client, ...data.login }));
  };

  // Create form errors and show them in the form accordingly.
  // eslint-disable-next-line
  const onError = (errors: any) => {
    const formErrors = createFormErrors(errors);
    Object.keys(formErrors).forEach(
      key => ref.current.setFieldError(key, (formErrors as any)[key]) // eslint-disable-line
    );
  };

  const [registerMutation] = useRegisterMutation({ onCompleted, onError });

  const onSubmit = async (
    values: RegisterFormValues,
    actions: FormikActions<RegisterFormValues>
  ): Promise<void> => {
    const { username, email, password } = values;
    await registerMutation({ variables: { username, email, password } });
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
