import { Button } from '@material-ui/core';
import { Field, Form, FormikProps } from 'formik';
import React from 'react';
import { FeedbackFormValues } from '../../interfaces';
import { Textarea } from '../atoms';

export const FeedbackForm: React.ComponentType<FormikProps<FeedbackFormValues>> = () => (
  <Form>
    <Field
      name="comment"
      component={Textarea}
      placeholder="Tell us how we can improve our company."
      label="Comment"
    />
    <Button variant="contained" color="primary" type="submit">
      submit
    </Button>
  </Form>
);
