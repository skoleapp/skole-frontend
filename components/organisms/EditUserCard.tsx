import { Typography } from '@material-ui/core';
import { Formik } from 'formik';
import React from 'react';
import { UserMe } from '../../interfaces';
import { Card } from '../containers';
import { EditUserForm } from '../forms';

interface Props {
  initialValues: UserMe;
}

export const EditUserCard: React.FC<Props> = ({ initialValues }) => {
  // TODO: Finish this.
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
