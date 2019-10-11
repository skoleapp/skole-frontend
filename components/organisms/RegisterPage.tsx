import { Formik, FormikActions } from 'formik';
import Link from 'next/link';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { getApiUrl, skoleAPI } from '../../api';
import { RegisterFormValues } from '../../interfaces';
import { createFormErrors } from '../../utils';
import { Button, Card, H1, H2 } from '../atoms';
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
  const [registered, setRegistered] = useState(false);

  const onSubmit = async (
    values: RegisterFormValues,
    actions: FormikActions<RegisterFormValues>
  ): Promise<void> => {
    const { username, email, password, confirmPassword } = values;

    const payload = {
      username,
      email,
      password: {
        password,
        confirm_password: confirmPassword // eslint-disable-line
      }
    };

    // const [registerMutation] = useMutation(REGISTER);
    // const data = loginMutation({
    //   variables: {
    //     username,
    //     email,
    //     password
    //   }
    // });

    // console.log(data);

    try {
      const url = getApiUrl('register');
      const { data, status } = await skoleAPI.post(url, payload);

      if (status === 201) {
        setRegistered(true);
      } else {
        const errors = await createFormErrors(data.error);
        Object.keys(errors).forEach(key => {
          actions.setFieldError(key, (errors as any)[key]);
        });
      }
    } catch (error) {
      actions.setFieldError('general', 'Network error.');
    } finally {
      actions.setSubmitting(false);
    }
  };

  if (registered) {
    return (
      <Card>
        <H2>Successfully registered new user!</H2>
        <Link href="/login">
          <Button>login here</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <H1>Register</H1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        component={RegisterForm}
      />
    </Card>
  );
};
