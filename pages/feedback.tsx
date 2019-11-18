import { Button, ButtonGroup, Typography } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import * as Yup from 'yup';
import { openNotification } from '../actions';
import { StyledCard } from '../components';
import { FeedbackForm, Layout } from '../containers';
import { FeedbackFormValues, FeedbackType, SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync } from '../utils';

const initialValues = {
  comment: '',
  general: ''
};

const validationSchema = Yup.object().shape({
  comment: Yup.string().required('Please tell us some details about your feedback.')
});

const FeedbackPage: NextPage = () => {
  const [rate, setRate] = useState<FeedbackType>('');
  const dispatch = useDispatch();

  // TODO: Finish this.
  const onSubmit = async (
    values: FeedbackFormValues,
    actions: FormikActions<FeedbackFormValues>
  ): Promise<void> => {
    console.log({ ...values, rate });
    dispatch(openNotification('Feedback submitted!'));
    actions.setSubmitting(false);
    actions.resetForm();
  };

  return (
    <Layout heading="Feedback" title="Feedback" backUrl="/">
      <StyledCard>
        <Typography variant="h5">How do you like Skole?</Typography>
        <StyledButtonGroup fullWidth aria-label="full width outlined button group">
          <Button value="Good" onClick={(): void => setRate('good')} color="primary">
            good
          </Button>
          <Button value="Neutral" onClick={(): void => setRate('neutral')} color="primary">
            neutral
          </Button>
          <Button value="Bad" onClick={(): void => setRate('bad')} color="primary">
            bad
          </Button>
        </StyledButtonGroup>
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
          component={FeedbackForm}
        />
      </StyledCard>
    </Layout>
  );
};

const StyledButtonGroup = styled(ButtonGroup)`
  margin: 0.5rem 0;

  .MuiButton-root {
    &:focus {
      background-color: var(--primary);
      color: var(--secondary);
    }
  }
`;

FeedbackPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withRedux, withApollo)(FeedbackPage);
