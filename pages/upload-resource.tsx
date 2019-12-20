import {
  Box,
  Button,
  CardHeader,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select as MaterialSelect,
  Typography
} from '@material-ui/core';
import { AddCircleOutline, DeleteOutline } from '@material-ui/icons';
import { ErrorMessage, Field, Formik, FormikProps } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { openNotification } from '../actions';
import {
  FormErrorMessage,
  FormSubmitSection,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm
} from '../components';
import { UploadResourceInitialDataDocument } from '../generated/graphql';
import { Course, ResourceType, SkoleContext, UploadResourceFormValues } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useForm, usePrivatePage } from '../utils';

const validationSchema = Yup.object().shape({
  resourceTitle: Yup.string().required('Resource title is required.'),
  resourceType: Yup.string().required('Resource type is required.'),
  courseId: Yup.string().required('Course is required.'),
  resource: Yup.string().required('Resource is required.')
});

interface Props {
  resourceTypes?: ResourceType[];
  courses?: Course[];
}

interface ResourcePart {
  index: number;
  number: string;
}

const UploadResourcePage: NextPage<Props> = ({ resourceTypes, courses }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { ref, setSubmitting, resetForm, setFieldValue } = useForm();

  const handleSubmit = async (values: UploadResourceFormValues) => {
    console.log(values);
    setSubmitting(false);
    resetForm();
    dispatch(openNotification('Resource uploaded!'));
    await router.push('/');
  };

  const initialValues = {
    resourceTitle: '',
    resourceType: '',
    courseId: (router.query.courseId as string) || '',
    resource: '',
    resourceParts: null,
    general: ''
  };

  const [uploaded, setUploaded] = useState(false);
  const [amountOfExercises, setAmountOfExercises] = useState('0');
  const [resourceParts, setResourceParts] = useState<ResourcePart[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (e: ChangeEvent<any>) => {
    const newFile = e.currentTarget.files[0];
    setFieldValue('resource', newFile);
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
    setFieldValue('resourceParts', newResourceParts);
  };

  // Remove icon click.
  const handleRemoveResourcePart = (index: number) => () => {
    const newResourceParts = resourceParts.filter(r => r.index !== index);
    setResourceParts(newResourceParts);
    setAmountOfExercises((parseInt(amountOfExercises) - 1).toString());
    setFieldValue('resourceParts', newResourceParts);
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
    setFieldValue('resourceParts', newResourceParts);
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
    setFieldValue('resourceParts', newResourceParts);
  };

  const renderForm = (props: FormikProps<UploadResourceFormValues>) => (
    <StyledForm>
      <Field
        name="resourceTitle"
        placeholder="Resource Title"
        label="Resource Title"
        component={TextField}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel>Resource Type</InputLabel>
        <Field name="resourceType" component={Select}>
          <MenuItem value="">---</MenuItem>
          {resourceTypes &&
            resourceTypes.map((r: ResourceType, i: number) => (
              <MenuItem key={i} value={r.name}>
                {r.name}
              </MenuItem>
            ))}
        </Field>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Course</InputLabel>
        <Field name="courseId" component={Select}>
          <MenuItem value="">---</MenuItem>
          {courses &&
            courses.map((c: Course, i: number) => (
              <MenuItem key={i} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
        </Field>
      </FormControl>
      <FormControl fullWidth>
        <Box marginTop="1rem">
          <Typography variant="body2" color="textSecondary">
            You can add exercise numbers to your resource to allow more detailed discussion.
          </Typography>
        </Box>
      </FormControl>
      <Box marginTop="0.5rem" display="flex" justifyContent="center" alignItems="center">
        <FormControl fullWidth>
          <InputLabel>Exercises</InputLabel>
          <MaterialSelect onChange={handleExercisesChange} value={amountOfExercises} fullWidth>
            {exerciseOptions.map((o, i) => (
              <MenuItem key={i} value={o.value}>
                {o.name}
              </MenuItem>
            ))}
          </MaterialSelect>
        </FormControl>
        <IconButton color="primary" onClick={handleAddResourcePart}>
          <AddCircleOutline />
        </IconButton>
      </Box>
      {resourceParts.map((r: ResourcePart, i: number) => (
        <Box key={i} marginTop="0.5rem" display="flex" justifyContent="center">
          <FormControl fullWidth>
            <InputLabel>Exercise {r.number}: Exercise Number</InputLabel>
            <Input
              type="number"
              placeholder="Exercise Number"
              value={r.number}
              onChange={handleResourcePartChange(r.index)}
              fullWidth
            />
          </FormControl>
          <IconButton color="primary" onClick={handleRemoveResourcePart(r.index)}>
            <DeleteOutline />
          </IconButton>
        </Box>
      ))}
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

  return (
    <Layout title="Upload Resource" backUrl>
      <StyledCard>
        <CardHeader title="Upload Resource" />
        <SlimCardContent>
          <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            ref={ref}
          >
            {renderForm}
          </Formik>
        </SlimCardContent>
      </StyledCard>
    </Layout>
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
    name: 15,
    value: 15
  },
  {
    name: 20,
    value: 20
  },
  {
    name: 25,
    value: 25
  },
  {
    name: 50,
    value: 50
  },
  {
    name: 75,
    value: 75
  },
  {
    name: 100,
    value: 100
  }
];

UploadResourcePage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await usePrivatePage(ctx);

  try {
    const { data } = await ctx.apolloClient.query({ query: UploadResourceInitialDataDocument });
    return { ...data };
  } catch (err) {
    return {};
  }
};

export default compose(withApollo, withRedux)(UploadResourcePage);
