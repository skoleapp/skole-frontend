import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@material-ui/core';
import { AddCircleOutline, DeleteOutline } from '@material-ui/icons';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { ChangeEvent, useState } from 'react';
import { Course, ResourceType, UploadResourceFormValues } from '../../interfaces';
import {
  CourseField,
  FormErrorMessage,
  FormSubmitSection,
  ResourceTypeField,
  StyledForm
} from '../shared';

interface ResourcePart {
  index: number;
  number: string;
}

interface Props extends FormikProps<UploadResourceFormValues> {
  resourceTypes: ResourceType[];
  courses: Course[];
  t: (value: string) => any;
}

export const UploadResourceForm: React.FC<Props> = props => {
  const [uploaded, setUploaded] = useState(false);
  const [amountOfExercises, setAmountOfExercises] = useState('0');
  const [resourceParts, setResourceParts] = useState<ResourcePart[]>([]);
  const t = props.t;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (e: ChangeEvent<any>) => {
    const newFile = e.currentTarget.files[0];
    props.setFieldValue('resource', newFile);
    newFile && setUploaded(true);
  };

  // Add resource part button click.
  const handleAddResourcePart = () => {
    const index = resourceParts.length ? resourceParts[resourceParts.length - 1].index + 1 : 0;
    const number = resourceParts.length
      ? (parseInt(resourceParts[resourceParts.length - 1].number) + 1).toString()
      : '1';

    const newResourceParts = [...resourceParts, { index, number }];
    setResourceParts(newResourceParts);
    setAmountOfExercises((parseInt(amountOfExercises) + 1).toString());
    props.setFieldValue('resourceParts', newResourceParts);
  };

  // Remove icon click.
  const handleRemoveResourcePart = (index: number) => () => {
    const newResourceParts = resourceParts.filter(r => r.index !== index);
    setResourceParts(newResourceParts);
    setAmountOfExercises((parseInt(amountOfExercises) - 1).toString());
    props.setFieldValue('resourceParts', newResourceParts);
  };

  // Change a single resourcepart.
  const handleResourcePartChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const newResourceParts = resourceParts.map(r => {
      if (r.index === index) {
        r.number = e.target.value;
      }

      return r;
    });

    setResourceParts(newResourceParts);
    props.setFieldValue('resourceParts', newResourceParts);
  };

  // Change exercises select field.
  const handleExercisesChange = (e: any) => {
    const exercises = e.target.value;
    let newResourceParts: ResourcePart[] = [];

    for (let i = 0; i < exercises; i++) {
      const index = newResourceParts.length
        ? newResourceParts[newResourceParts.length - 1].index + 1
        : 0;
      const number = newResourceParts.length
        ? (parseInt(newResourceParts[newResourceParts.length - 1].number) + 1).toString()
        : '1';
      newResourceParts = [...newResourceParts, { index, number }];
    }

    setResourceParts(newResourceParts);
    setAmountOfExercises(exercises);
    props.setFieldValue('resourceParts', newResourceParts);
  };

  const renderResourceTitle = (
    <Field
      name="resourceTitle"
      placeholder={t('fieldResourceTitle')}
      label={t('fieldResourceTitle')}
      component={TextField}
      fullWidth
    />
  );

  const renderExercisesText = (
    <FormControl fullWidth>
      <Box marginTop="1rem">
        <Typography variant="body2" color="textSecondary">
          {t('textYouCanAddExerciseNumbersToYourResourceToAllowMoreDetailedDiscussion')}
        </Typography>
      </Box>
    </FormControl>
  );

  const renderExercises = (
    <Box marginTop="0.5rem" display="flex" justifyContent="center" alignItems="center">
      <FormControl fullWidth>
        <InputLabel>{t('headerExcercises')}</InputLabel>
        <Select onChange={handleExercisesChange} value={amountOfExercises} fullWidth>
          {exerciseOptions.map((o, i) => (
            <MenuItem key={i} value={o.value}>
              {o.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton color="primary" onClick={handleAddResourcePart}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  );

  const renderResourceParts = resourceParts.map((r: ResourcePart, i: number) => (
    <Box key={i} marginTop="0.5rem" display="flex" justifyContent="center">
      <FormControl fullWidth>
        <InputLabel>
          {t('headerExcercise')} {r.number}: {t('headerExcerciseNumber')}
        </InputLabel>
        <Input
          type="number"
          placeholder={t('fieldExcerciseNumber')}
          value={r.number}
          onChange={handleResourcePartChange(r.index)}
          fullWidth
        />
      </FormControl>
      <IconButton color="primary" onClick={handleRemoveResourcePart(r.index)}>
        <DeleteOutline />
      </IconButton>
    </Box>
  ));

  const renderUploadResourceField = (
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
            {uploaded ? t('textUploaded') : t('buttonUploadResource')}
          </Button>
        </label>
        <ErrorMessage name="resource" component={FormErrorMessage} />
      </Box>
    </FormControl>
  );

  return (
    <StyledForm>
      {renderResourceTitle}
      <ResourceTypeField {...props} />
      <CourseField {...props} />
      {renderExercisesText}
      {renderExercises}
      {renderResourceParts}
      {renderUploadResourceField}
      <FormSubmitSection submitButtonText={t('buttonSubmit')} {...props} />
    </StyledForm>
  );
};

const exerciseOptions = [
  {
    name: 0,
    value: 0
  },
  {
    name: 1,
    value: 1
  },
  {
    name: 2,
    value: 2
  },
  {
    name: 3,
    value: 3
  },
  {
    name: 4,
    value: 4
  },
  {
    name: 5,
    value: 5
  },
  {
    name: 10,
    value: 10
  },
  {
    name: 20,
    value: 20
  },
  {
    name: 50,
    value: 50
  },
  {
    name: 100,
    value: 100
  }
];
