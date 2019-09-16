import { Formik, FormikActions } from 'formik';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import { RegisterFormValues } from '../../interfaces';
import { register } from '../../redux';
import { registerInitialValues, registerSchema } from '../../static';
import { Anchor, H1 } from '../atoms';
import { RegisterForm } from '../molecules';

export const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();

  const onSubmit = async (
    values: RegisterFormValues,
    actions: FormikActions<RegisterFormValues>
  ): Promise<void> => {
    try {
      await dispatch(register(values));
      Router.push('/login');
    } catch (error) {
      const { payload } = error;
      Object.keys(payload).forEach(key => {
        actions.setFieldError(key, payload[key]);
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <>
      <H1>Register</H1>
      <Formik
        initialValues={registerInitialValues}
        validationSchema={registerSchema}
        onSubmit={onSubmit}
        component={RegisterForm}
      />
      <Link href="/login">
        <Anchor variant="red">Already a user?</Anchor>
      </Link>
    </>
  );
};
