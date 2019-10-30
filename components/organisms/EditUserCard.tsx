import { Typography } from '@material-ui/core';
import { Formik } from 'formik';
import React from 'react';
import { UserMe } from '../../interfaces';
import { Card } from '../atoms';
import { EditUserForm } from '../molecules';

interface Props {
  initialValues: UserMe;
}

export const EditUserCard: React.FC<Props> = ({ initialValues }) => {
  /*
   * TODO: Make a redux action that calls the /user/me endpoint with
   * a put request and returns a promise like in auth forms.
   * If the request is successful, update the store.
   * Otherwise display errors in the form accordingly.
   */
  const onSubmit = (values: UserMe): void => {
    console.log('Submit!', values);
  };

  return (
    <Card>
      <Typography variant="h5">Edit Account</Typography>
      <Formik component={EditUserForm} initialValues={initialValues} onSubmit={onSubmit} />
    </Card>
  );
};
