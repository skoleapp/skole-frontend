import { Button, ButtonGroup } from '@material-ui/core';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { FeedbackType } from '../../interfaces';

export interface Props {
  setRate: Dispatch<SetStateAction<FeedbackType>>;
}

export const FeedbackButtonSection: React.FC<Props> = ({ setRate }) => (
  <StyledFeedButtonSection>
    <ButtonGroup fullWidth aria-label="full width outlined button group">
      <Button value="Good" onClick={(): void => setRate('good')} color="primary">
        good
      </Button>
      <Button value="Neutral" onClick={(): void => setRate('neutral')} color="primary">
        neutral
      </Button>
      <Button value="Bad" onClick={(): void => setRate('bad')} color="primary">
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
