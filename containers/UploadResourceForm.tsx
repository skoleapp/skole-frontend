import { Typography, Button, FormControl, InputLabel, MenuItem, Box } from '@material-ui/core';
import React, { useState, ChangeEvent } from 'react';
import { Select, TextField } from 'formik-material-ui';
import { ErrorMessage, FormikProps, Field } from 'formik';
import { FormErrorMessage, StyledForm, FormSubmitSection } from '../components';
import { UploadResourceFormValues } from '../interfaces';

export const UploadResourceForm: React.FC<FormikProps<UploadResourceFormValues>> = props => {
  const [file, setFile] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (e: ChangeEvent<any>) => {
    const newFile = e.currentTarget.files[0];
    props.setFieldValue('resource', newFile);
    newFile && setFile(newFile.name);
  };

  return (
    <StyledForm>
      <Field name="title" placeholder="Title" label="Title" component={TextField} fullWidth />
      <FormControl fullWidth>
        <InputLabel>Type</InputLabel>
        <Field name="type" component={Select}>
          <MenuItem value="">---</MenuItem>
          <MenuItem value="Exam">Exam</MenuItem>
          <MenuItem value="Note">Note</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Field>
        <ErrorMessage name="type" component={FormErrorMessage} />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Course</InputLabel>
        <Field name="course" component={Select}>
          <MenuItem value="">---</MenuItem>
          <MenuItem value="Math1">Math</MenuItem>
          <MenuItem value="Math2">Math2</MenuItem>
          <MenuItem value="Math3">Math3</MenuItem>
        </Field>
        <ErrorMessage name="course" component={FormErrorMessage} />
      </FormControl>
      <Box display="flex" flexDirection="column" alignItems="center" className="change-avatar">
        <FormControl fullWidth>
          <Field
            value="" // The value cannot be programmatically mutated: https://stackoverflow.com/a/55582086/10504286
            name="resource"
            id="upload-resource"
            accept="image/*,./txt"
            type="file"
            component="input"
            onChange={handleFileChange}
          />
          <label htmlFor="upload-resource">
            <Button variant="outlined" color="primary" component="span">
              Upload resource
            </Button>
          </label>
          <ErrorMessage name="resource" component={FormErrorMessage} />
        </FormControl>
      </Box>
      {file !== '' && <Typography>{file}</Typography>}
      <FormSubmitSection submitButtonText="submit" {...props} />
    </StyledForm>
  );
};
