import { Formik } from 'formik';
import Link from 'next/link';
import React from 'react';
import { User } from '../../interfaces';
import { Button, H1 } from '../atoms';
import { EditAccountForm } from '../molecules';

interface Props {
  initialValues: User;
}

export const EditAccountPage: React.FC<Props> = ({ initialValues }) => {
  /*
   * TODO: Make a redux action that calls the /user/me endpoint with
   * a put request and returns a promise like in auth forms.
   * If the request is successful, update the store.
   * Otherwise display errors in the form accordingly.
   */
  const onSubmit = (values: any) => console.log('Submit!', values);

  return (
    <>
      <H1>Edit Account</H1>
      <Formik component={EditAccountForm} initialValues={initialValues} onSubmit={onSubmit} />
      <Link href="/account">
        <Button>back to account</Button>
      </Link>
    </>
  );
};
