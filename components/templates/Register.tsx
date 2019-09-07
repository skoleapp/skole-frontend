import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import { Flexbox, Input } from '../atoms';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { register } from '../../redux';

const registerSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string()
    .email('Email is invalid')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Passwords must match')
});

interface FormikValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Register: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={registerSchema}
      onSubmit={(fields: FormikValues): void => {
        console.log(fields);
        dispatch(register(fields));
      }}
      render={({ values, setFieldValue }): React.ReactNode | undefined => (
        <Form>
          <Flexbox justifyContent="center" flexDirection="column">
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
          </Flexbox>
          <Flexbox justifyContent="center" flexDirection="column">
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
          </Flexbox>
          <Flexbox justifyContent="center" flexDirection="column">
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
          </Flexbox>
          <Flexbox justifyContent="center" flexDirection="column">
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
          </Flexbox>
          <Flexbox justifyContent="center">
            <button type="submit" className="btn btn-primary mr-2">
              Register
            </button>
            <button type="reset" className="btn btn-secondary">
              Reset
            </button>
          </Flexbox>
        </Form>
      )}
    />
  );
};
