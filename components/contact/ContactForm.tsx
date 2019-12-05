import { Button, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React from 'react';
import { ContactFormValues } from '../../interfaces';
import { FormErrorMessage, StyledForm } from '../shared';

export const ContactForm: React.ComponentType<FormikProps<ContactFormValues>> = () => (
  <StyledForm>
    <FormControl fullWidth>
      <InputLabel>Type</InputLabel>
      <Field name="contactType" component={Select} fullWidth>
        <MenuItem value="">---</MenuItem>
        <MenuItem value="feedback">Feedback</MenuItem>
        <MenuItem value="requestSchool">Request New School</MenuItem>
        <MenuItem value="requestSubject">Request New Subject</MenuItem>
        <MenuItem value="businessInquiry">Business Inquiry</MenuItem>
      </Field>
      <ErrorMessage name="contactType" component={FormErrorMessage} />
    </FormControl>
    <Field
      name="email"
      component={TextField}
      label="Email"
      placeholder="example@skole.io"
      fullWidth
    />
    <Field
      name="message"
      component={TextField}
      placeholder="Message"
      label="Message"
      fullWidth
      multiline
    />
    <Button fullWidth variant="contained" color="primary" type="submit">
      submit
    </Button>
  </StyledForm>
);
