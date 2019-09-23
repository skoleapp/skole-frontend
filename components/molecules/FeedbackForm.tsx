import { Field, Form, FormikProps } from 'formik';
import React from 'react';
import { FeedbackFormValues } from '../../interfaces';
import { Button, Textarea } from '../atoms';

export const FeedbackForm: React.ComponentType<FormikProps<FeedbackFormValues>> = () => (
  <Form>
    <Field
      name="comment"
      component={Textarea}
      placeholder="Tell us how we can improve our company."
      label="Comment"
    />
    <Button type="submit">submit</Button>
  </Form>
);
