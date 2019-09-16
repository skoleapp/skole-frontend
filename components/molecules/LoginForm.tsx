import { ErrorMessage, Formik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { State } from '../../interfaces';
import { login } from '../../redux';
import { Button, Input, StyledForm } from '../atoms';
import { Column } from '../containers';
import { LoadingScreen } from '../layout';

const loginSchema = Yup.object().shape({
  usernameOrEmail: Yup.string().required('Username or email is required!'),
  password: Yup.string().required('Password is required!')
});

interface FormikValues {
  usernameOrEmail: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: State) => state.auth);

  const onSubmit = (fields: FormikValues): void => {
    dispatch(login(fields));
  };

  if (loading) {
    return <LoadingScreen loadingText="Logging in..." />;
  }

  return (
    <Formik
      initialValues={{
        usernameOrEmail: '',
        password: ''
      }}
      validationSchema={loginSchema}
      onSubmit={onSubmit}
      render={({ values, setFieldValue }): React.ReactNode | undefined => (
        <StyledForm>
          <Column>
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setFieldValue('usernameOrEmail', e.target.value)
              }
              value={values.usernameOrEmail}
              placeholder="Username or email"
              name="usernameOrEmail"
              type="text"
            />
            <ErrorMessage name="usernameOrEmail" component="div" className="invalid-feedback" />
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setFieldValue('password', e.target.value)
              }
              value={values.password}
              placeholder="Password"
              name="password"
              type="password"
            />
            <ErrorMessage name="password" component="div" className="invalid-feedback" />
            <Button type="submit">login</Button>
          </Column>
        </StyledForm>
      )}
    />
  );
};
