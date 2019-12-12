import { Button, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React from 'react';
import { ContactFormValues } from '../../interfaces';
import { FormErrorMessage, StyledForm } from '../shared';

export const ContactForm: React.ComponentType<FormikProps<ContactFormValues>> = ({ t }: any) => (
  <StyledForm>
    <FormControl fullWidth>
      <InputLabel>Type</InputLabel>
      <Field name="contactType" component={Select} fullWidth>
        <MenuItem value="">---</MenuItem>
        <MenuItem value="feedback">{t('buttonFeedback')}</MenuItem>
        <MenuItem value="requestSchool">{t('buttonRequestNewSchool')}</MenuItem>
        <MenuItem value="requestSubject">{t('buttonRequestNewSchool')}</MenuItem>
        <MenuItem value="businessInquiry">{t('buttonBusinessInquiry')}</MenuItem>
      </Field>
      <ErrorMessage name="contactType" component={FormErrorMessage} />
    </FormControl>
    <Field
      name="email"
      component={TextField}
      label={t('fieldEmail')}
      placeholder={t('example@skole.io')}
      fullWidth
    />
    <Field
      name="message"
      component={TextField}
      label={t('fieldMessage')}
      placeholder={t('fieldMessage')}
      fullWidth
      multiline
    />
    <Button fullWidth variant="contained" color="primary" type="submit">
      {t('buttonSubmit')}
    </Button>
  </StyledForm>
);
