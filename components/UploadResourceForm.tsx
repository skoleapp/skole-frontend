import { Box, Button, FormControl } from '@material-ui/core';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { ChangeEvent, useState } from 'react';
import {
  CourseField,
  FormErrorMessage,
  FormSubmitSection,
  ResourceTypeField,
  StyledForm
} from '../components';
import { UploadResourceFormValues } from '../interfaces';

export const UploadResourceForm: React.FC<FormikProps<UploadResourceFormValues>> = props => {
  const [uploaded, setUploaded] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (e: ChangeEvent<any>) => {
    const newFile = e.currentTarget.files[0];
    props.setFieldValue('resource', newFile);
    newFile && setUploaded(true);
  };

  return (
    <StyledForm>
      <Field
        name="resourceTitle"
        placeholder="Resource Title"
        label="Resource Title"
        component={TextField}
        fullWidth
      />
      <ResourceTypeField {...props} />
      <CourseField {...props} />
      <FormControl fullWidth>
        <Box display="flex" flexDirection="column" alignItems="center" className="file-input">
          <Field
            value=""
            name="resource"
            id="upload-resource"
            accept="image/*,./txt"
            type="file"
            component="input"
            onChange={handleFileChange}
          />
          <label htmlFor="upload-resource">
            <Button variant="outlined" color="primary" component="span" fullWidth>
              {uploaded ? 'uploaded' : 'upload resource'}
            </Button>
          </label>
          <ErrorMessage name="resource" component={FormErrorMessage} />
        </Box>
      </FormControl>
      <FormSubmitSection submitButtonText="submit" {...props} />
    </StyledForm>
  );
};
