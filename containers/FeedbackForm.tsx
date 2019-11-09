import { Button } from '@material-ui/core';
import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { StyledForm } from '../components';
import { FeedbackFormValues } from '../interfaces';

export const FeedbackForm: React.ComponentType<FormikProps<FeedbackFormValues>> = () => (
  <StyledForm>
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
  </StyledForm>
);
