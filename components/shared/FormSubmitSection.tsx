import { Box, Button, CircularProgress, FormControl } from '@material-ui/core';
import { ErrorMessage, FormikProps } from 'formik';
import React from 'react';
import { FormErrorMessage } from '.';

interface FormSubmitSectionProps extends FormikProps<any> {
  submitButtonText: string;
}

export const FormSubmitSection: React.FC<FormSubmitSectionProps> = ({
  isSubmitting,
  submitButtonText
}) => (
  <FormControl fullWidth>
    <Box display="flex" flexDirection="column" alignItems="center">
      {isSubmitting ? (
        <CircularProgress color="primary" />
      ) : (
        <ErrorMessage name="general" component={FormErrorMessage} />
      )}
      <Button type="submit" disabled={isSubmitting} variant="contained" color="primary" fullWidth>
        {submitButtonText}
      </Button>
    </Box>
  </FormControl>
);
