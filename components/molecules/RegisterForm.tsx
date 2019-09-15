import { ErrorMessage, Formik } from 'formik';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { State } from '../../interfaces';
import { register } from '../../redux';
import { Button, Input, StyledForm } from '../atoms';
import { LoadingScreen } from '../layout';
import { Redirect } from '../utils';

const registerSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string()
    .email('Invalid email!')
    .required('Email is required!'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long!')
    .required('Password is required!'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match!')
    .required('Confirm password is required!')
});

interface FormikValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm: React.FC = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: State) => state.auth);
  const [registered, setRegistered] = useState(false);

  const onSubmit = (fields: FormikValues): void => {
    dispatch(register(fields))
      .then(() => setRegistered(true))
      .catch(() => console.log('Error registering user...'));
  };

  if (loading) {
    return <LoadingScreen loadingText="Logging in..." />;
  }

  if (registered) {
    return <Redirect to="/login" loadingText="Successfully registered new user!" />;
  }

  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={registerSchema}
      onSubmit={onSubmit}
      render={({ values, setFieldValue }): React.ReactNode | undefined => (
        <StyledForm>
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setFieldValue('username', e.target.value)
            }
            value={values['username']}
            placeholder="Username"
            name="username"
            type="text"
          />
          <ErrorMessage name="username" component="div" className="invalid-feedback" />
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setFieldValue('email', e.target.value)
            }
            value={values['email']}
            placeholder="Email"
            name="email"
            type="text"
          />
          <ErrorMessage name="email" component="div" className="invalid-feedback" />
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setFieldValue('password', e.target.value)
            }
            value={values['password']}
            placeholder="Password"
            name="password"
            type="password"
          />
          <ErrorMessage name="password" component="div" className="invalid-feedback" />
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setFieldValue('confirmPassword', e.target.value)
            }
            value={values['confirmPassword']}
            placeholder="Confirm password"
            name="confirmPassword"
            type="password"
          />
          <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
          <Button type="submit">register</Button>
        </StyledForm>
      )}
    />
  );
};
