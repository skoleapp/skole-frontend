import { Button } from '@material-ui/core';
import React, { Dispatch, SetStateAction } from 'react';
import { FeedbackType } from '../../types';

export interface Props {
  setRate: Dispatch<SetStateAction<FeedbackType>>;
  rate: FeedbackType;
}

export const FeedbackButtonSection: React.FC<Props> = ({ setRate }) => (
  <>
    <Button
      value="good"
      // selected={rate === 'good'}
      onClick={(): void => setRate('good')}
      color="primary"
    >
      good
    </Button>
    <Button
      value="neutral"
      // selected={rate === 'neutral'}
      onClick={(): void => setRate('neutral')}
      color="primary"
    >
      neutral
    </Button>
    <Button
      value="bad"
      // selected={rate === 'bad'}
      onClick={(): void => setRate('bad')}
      color="primary"
    >
      bad
    </Button>
  </>
);
