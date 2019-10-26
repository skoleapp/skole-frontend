import { Button, ButtonGroup } from '@material-ui/core';
import React, { Dispatch, SetStateAction } from 'react';
import { FeedbackType } from '../../types';
import styled from 'styled-components';

export interface Props {
  setRate: Dispatch<SetStateAction<FeedbackType>>;
  rate: FeedbackType;
}

export const FeedbackButtonSection: React.FC<Props> = ({ setRate }) => (
  <StyledFeedButtonSection>
    <ButtonGroup fullWidth aria-label="full width outlined button group">
      <Button
        value="Good"
        // selected={rate === 'good'}
        onClick={(): void => setRate('good')}
        color="primary"
      >
        good
      </Button>
      <Button
        value="Neutral"
        // selected={rate === 'neutral'}
        onClick={(): void => setRate('neutral')}
        color="primary"
      >
        neutral
      </Button>
      <Button
        value="Bad"
        // selected={rate === 'bad'}
        onClick={(): void => setRate('bad')}
        color="primary"
      >
        bad
      </Button>
    </ButtonGroup>
  </StyledFeedButtonSection>
);

const StyledFeedButtonSection = styled.div`
  button {
    margin-top: 1rem;
    &:focus {
      background-color: var(--primary);
      color: var(--white);
    }
  }
`;
