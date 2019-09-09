import { ErrorMessage, Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { login } from '../../redux';
import { Button, Input } from '../atoms';
import { Row } from '../containers';

const loginSchema = Yup.object().shape({
  usernameOrEmail: Yup.string().required('Username or email is required'),
  password: Yup.string().required('Password is required')
});

interface FormikValues {
  usernameOrEmail: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        usernameOrEmail: '',
        password: ''
      }}
      validationSchema={loginSchema}
      onSubmit={(fields: FormikValues): void => {
        dispatch(login(fields));
      }}
      render={({ values, setFieldValue }): React.ReactNode | undefined => (
        <Form>
          <Row>
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setFieldValue('usernameOrEmail', e.target.value)
              }
              value={values['usernameOrEmail']}
              placeholder="Username or email"
              name="usernameOrEmail"
              type="text"
            />
            <ErrorMessage name="usernameOrEmail" component="div" className="invalid-feedback" />
          </Row>
          <Row>
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
          </Row>
          <Button type="submit">login</Button>
        </Form>
      )}
    />
  );
};
