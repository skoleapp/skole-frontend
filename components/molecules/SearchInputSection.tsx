import { Button } from '@material-ui/core';
import { Field, FormikProps } from 'formik';
import React from 'react';
import { SearchFormProps } from '../../interfaces';
import { Form, SearchInput } from '../atoms';
import { Row } from '../containers';

export const SearchInputSection: React.ComponentType<FormikProps<SearchFormProps>> = props => (
  <Form {...props}>
    <Row>
      <Field name="search" placeholder="Search anything!" component={SearchInput} />
      <Button variant="outlined" color="primary">
        go
      </Button>
    </Row>
  </Form>
);
