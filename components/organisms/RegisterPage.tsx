import { Formik, FormikActions } from 'formik';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { RegisterFormValues } from '../../interfaces';
import { register } from '../../redux';
import { Anchor, Button, H1, H3 } from '../atoms';
import { RegisterForm } from '../molecules';

const initialValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
  general: ''
};

export const validationSchema = Yup.object().shape({
  username: Yup.string()
    .label('Username')
    .required('Username is required.'),
  email: Yup.string()
    .label('Email')
    .email('Invalid email.')
    .required('Email is required.'),
  password: Yup.string()
    .label('Password')
    .min(6, 'Password must be at least 6 characters long.')
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .label('Confirm Password')
    .oneOf([Yup.ref('password'), null], 'Passwords do not match.')
    .required('Confirm password is required.'),
  agreeToTerms: Yup.boolean()
    .label('Agree to Terms')
    .test('is-true', 'You must agree to terms to continue', (value: boolean) => value === true)
});

export const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const [registered, setRegistered] = useState(false);

  const onSubmit = async (
    values: RegisterFormValues,
    actions: FormikActions<RegisterFormValues>
  ): Promise<void> => {
    try {
      await dispatch(register(values));
      setRegistered(true);
    } catch (error) {
      const { payload } = error;
      Object.keys(payload).forEach(key => {
        actions.setFieldError(key, payload[key]);
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  if (registered) {
    return (
      <>
        <H3>Successfully registered new user!</H3>
        <Link href="/login">
          <Button>login here</Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <H1>Register</H1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        component={RegisterForm}
      />
      <Link href="/login">
        <Anchor variant="red">Already a user?</Anchor>
      </Link>
    </>
  );
};
