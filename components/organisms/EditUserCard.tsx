import { Button, Link, Typography } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { updateUserMe } from '../../actions';
import { useUpdateUserMutation } from '../../generated/graphql';
import { UpdateUserForm, UserMe } from '../../interfaces';
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
  language: Yup.string().oneOf(['English', 'Finnish', 'Swedish'], 'Invalid language.')
});

interface Props {
  user: UserMe;
}

export const EditUserCard: React.FC<Props> = ({ user }) => {
  const [completed, setCompleted] = useState(false);
  const ref = useRef<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCompleted = ({ updateUser }: any): void => {
    if (updateUser.errors) {
      return onError(updateUser.errors);
    } else {
      setCompleted(true);
      dispatch(updateUserMe(updateUser.user));
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
    const { username, email, title, bio, avatar, language } = values;

    await updateUserMutation({
      variables: {
        username,
        email,
        title,
        bio,
        avatar,
        language: language.toUpperCase()
      }
    });

    actions.setSubmitting(false);
  };

  const initialValues = {
    id: (user && user.id) || '',
    title: (user && user.title) || '',
    username: (user && user.username) || '',
    email: (user && user.email) || '',
    bio: (user && user.bio) || '',
    avatar: (user && user.avatar) || '',
    language: (user && user.language) || '',
    points: (user && user.points) || 0,
    general: ''
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
