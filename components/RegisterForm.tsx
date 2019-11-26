import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Link,
  Typography
} from '@material-ui/core';
import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { useState } from 'react';
import { FormSubmitSection, StyledForm, TextLink } from '.';
import { RegisterFormValues } from '../interfaces';
import { StyledDialog } from './StyledDialog';

export const RegisterForm: React.FC<FormikProps<RegisterFormValues>> = props => {
  const [termsOpen, setTermsOpen] = useState(false);
  const handleOpenTerms = () => setTermsOpen(true);
  const handleCloseTerms = () => setTermsOpen(false);

  const renderForm = (
    <StyledForm>
      <Field
        placeholder="Username"
        name="username"
        component={TextField}
        label="Username"
        fullWidth
      />
      <Field placeholder="Email" name="email" component={TextField} label="Email" fullWidth />
      <Field
        placeholder="Password"
        name="password"
        component={TextField}
        label="Password"
        type="password"
        fullWidth
      />
      <Field
        placeholder="Confirm password"
        name="confirmPassword"
        type="password"
        component={TextField}
        label="Confirm Password"
        fullWidth
      />
      <FormControl fullWidth>
        <Box marginTop="0.5rem">
          <Typography variant="body2" color="textSecondary">
            By registering you agree to our <Link onClick={handleOpenTerms}>Terms</Link>.
          </Typography>
        </Box>
      </FormControl>
      <FormSubmitSection submitButtonText="register" {...props} />
      <FormControl>
        <TextLink href="/login" color="primary">
          Already a user?
        </TextLink>
      </FormControl>
    </StyledForm>
  );

  const renderDialog = (
    <StyledDialog open={termsOpen} onClose={handleCloseTerms}>
      <DialogTitle>Skole Terms</DialogTitle>
      <DialogContent>
        <DialogContentText>Werneri missä vitussa on meidän käyttöehdot?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseTerms} color="primary">
          close
        </Button>
      </DialogActions>
    </StyledDialog>
  );

  return (
    <>
      {renderForm}
      {renderDialog}
    </>
  );
};
