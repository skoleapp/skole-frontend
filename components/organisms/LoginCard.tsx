import { Typography } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import React, { useRef } from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { login } from '../../actions';
import { useLoginMutation } from '../../generated/graphql';
import { LoginFormValues } from '../../interfaces';
import { createFormErrors } from '../../utils';
import { Card } from '../atoms';
import { LoginForm } from '../molecules';

const initialValues = {
  email: '',
  password: '',
  general: ''
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email.')
    .required('Email is required.'),
  password: Yup.string().required('Password is required!')
});

export const LoginCard: React.FC = () => {
  const client = useApolloClient();
  const ref = useRef<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch();

  // eslint-disable-next-line
  const onCompleted = (data: any) => dispatch(login({ client, ...data.login }));

  // Create form errors and show them in the form accordingly.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (errors: any): void => {
    const formErrors = createFormErrors(errors);
    Object.keys(formErrors).forEach(
      key => ref.current.setFieldError(key, (formErrors as any)[key]) // eslint-disable-line @typescript-eslint/no-explicit-any
    );
  };

  const [loginMutation] = useLoginMutation({ onCompleted, onError });

  const onSubmit = async (
    values: LoginFormValues,
    actions: FormikActions<LoginFormValues>
  ): Promise<void> => {
    const { email, password } = values;
    await loginMutation({ variables: { email, password } });
    actions.setSubmitting(false);
  };

  return (
    <Card>
      <Typography variant="h5">login</Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        component={LoginForm}
        ref={ref}
      />
    </Card>
  );
};
