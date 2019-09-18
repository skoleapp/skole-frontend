import { Field, FormikProps } from 'formik';
import React from 'react';
import { Form, GoButton, SearchInput } from '../atoms';
import { Row } from '../containers';

export const SearchInputSection: React.ComponentType<FormikProps<any>> = props => (
  <Form {...props}>
    <Row>
      <Field name="search" placeholder="Search courses..." component={SearchInput} />
      <GoButton />
    </Row>
  </Form>
);
