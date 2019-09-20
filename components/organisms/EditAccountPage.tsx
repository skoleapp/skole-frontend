import { Formik } from 'formik';
import Link from 'next/link';
import React from 'react';
import { User } from '../../interfaces';
import { Button, H1 } from '../atoms';
import { EditAccountForm } from '../molecules';

const onSubmit = (values: any) => console.log(values);

interface Props {
  initialValues: User;
}

export const EditAccountPage: React.FC<Props> = ({ initialValues }) => (
  <>
    <H1>Edit Account</H1>
    <Formik component={EditAccountForm} initialValues={initialValues} onSubmit={onSubmit} />
    <Link href="/account">
      <Button>back to account</Button>
    </Link>
  </>
);
