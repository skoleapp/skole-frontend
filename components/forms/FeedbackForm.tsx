import { Button } from '@material-ui/core';
import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { FeedbackFormValues } from '../../interfaces';
import { Form } from '../containers';

export const FeedbackForm: React.ComponentType<FormikProps<FeedbackFormValues>> = () => (
  <Form>
    <Field
      name="comment"
      component={TextField}
      placeholder="Tell us how we can improve our company."
      label="Comment"
      fullWidth
      multiline
    />
    <Button fullWidth variant="contained" color="primary" type="submit">
      submit
    </Button>
  </Form>
);
