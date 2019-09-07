import React from 'react';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { login } from '../../redux';
import { Flexbox, Input } from '../atoms';
import { Formik, Form, ErrorMessage } from 'formik';

const loginSchema = Yup.object().shape({
  usernameOrEmail: Yup.string().required('Username or email is required'),
  password: Yup.string().required('Password is required')
});

export const Login: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        usernameOrEmail: '',
        password: ''
      }}
      validationSchema={loginSchema}
      onSubmit={fields => {
        dispatch(login(fields));
      }}
      render={({ values, setFieldValue }) => (
        <Form>
          <Flexbox justifyContent="center" flexDirection="column">
            <Input
              onChange={e => setFieldValue('usernameOrEmail', e.target.value)}
              value={values['usernameOrEmail']}
              placeholder="Username or email"
              name="usernameOrEmail"
              type="text"
            />
            <ErrorMessage name="usernameOrEmail" component="div" className="invalid-feedback" />
          </Flexbox>
          <Flexbox justifyContent="center" flexDirection="column">
            <Input
              onChange={e => setFieldValue('password', e.target.value)}
              value={values['password']}
              placeholder="Password"
              name="password"
              type="password"
            />
            <ErrorMessage name="password" component="div" className="invalid-feedback" />
          </Flexbox>
          <Flexbox justifyContent="center">
            <button type="submit" className="btn btn-primary mr-2">
              Login
            </button>
          </Flexbox>
        </Form>
      )}
    />
  );
};
