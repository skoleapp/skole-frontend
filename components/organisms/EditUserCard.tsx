import { Button, Typography } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { setUserMe } from '../../actions';
import { useUpdateUserMutation } from '../../generated/graphql';
import { UpdateUserForm } from '../../interfaces';
import { createFormErrors } from '../../utils';
import { Card } from '../containers';
import { EditUserForm } from '../forms';

const validationSchema = Yup.object().shape({
  title: Yup.string(),
  username: Yup.string().required('Username is required.'),
  email: Yup.string()
    .email('Invalid email.')
    .required('Email is required.'),
  bio: Yup.string(),
  language: Yup.string().oneOf(['asd', 'Finnish'], 'Invalid language.')
});

interface Props {
  initialValues: UpdateUserForm;
}

export const EditUserCard: React.FC<Props> = ({ initialValues }) => {
  const [completed, setCompleted] = useState(false);
  const ref = useRef<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCompleted = ({ updateUser }: any): void => {
    if (updateUser.errors) {
      const formErrors = createFormErrors(updateUser.errors);
      Object.keys(formErrors).forEach(
        key => ref.current.setFieldError(key, (formErrors as any)[key]) // eslint-disable-line @typescript-eslint/no-explicit-any
      );
    } else {
      setCompleted(true);
      dispatch(setUserMe(updateUser.user));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (errors: any): void => {
    const formErrors = createFormErrors(errors);
    Object.keys(formErrors).forEach(
      key => ref.current.setFieldError(key, (formErrors as any)[key]) // eslint-disable-line @typescript-eslint/no-explicit-any
    );
  };

  const [updateUserMutation] = useUpdateUserMutation({ onCompleted, onError });

  const handleSubmit = async (
    values: UpdateUserForm,
    actions: FormikActions<UpdateUserForm>
  ): Promise<void> => {
    const { username, email, title, bio, language } = values;

    await updateUserMutation({
      variables: {
        username,
        email,
        title,
        bio,
        language: language.toUpperCase()
      }
    });

    actions.setSubmitting(false);
  };

  if (completed) {
    return (
      <Card>
        <Typography variant="h5">Account Edited!</Typography>
        <Link href="/account">
          <Button fullWidth variant="outlined" color="primary">
            Back to Account
          </Button>
        </Link>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={(): void => setCompleted(false)}
        >
          Edit Again
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <Typography variant="h5">Edit Account</Typography>
      <Formik
        component={EditUserForm}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        ref={ref}
      />
    </Card>
  );
};
