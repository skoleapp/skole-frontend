import React, { Dispatch, SetStateAction } from 'react';
import { FeedbackType } from '../../types';
import { FeedbackButton } from '../atoms';

export interface Props {
  setRate: Dispatch<SetStateAction<FeedbackType>>;
  rate: FeedbackType;
}

export const FeedbackButtonSection: React.FC<Props> = ({ rate, setRate }) => (
  <>
    <FeedbackButton
      value="good"
      type="button"
      selected={rate === 'good'}
      onClick={(): void => setRate('good')}
      color="var(--success)"
    >
      good
    </FeedbackButton>
    <FeedbackButton
      value="neutral"
      type="button"
      selected={rate === 'neutral'}
      onClick={(): void => setRate('neutral')}
      color="var(--warning)"
    >
      neutral
    </FeedbackButton>
    <FeedbackButton
      value="bad"
      type="button"
      selected={rate === 'bad'}
      onClick={(): void => setRate('bad')}
      color="var(--danger)"
    >
      bad
    </FeedbackButton>
  </>
);
