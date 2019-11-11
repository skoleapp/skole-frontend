import { Button } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

interface Props {
  text: string;
}

export const LabelTag: React.FC<Props> = ({ text }) => (
  <StyledLabel variant="outlined" color="primary" className="label">
    {text}
  </StyledLabel>
);

const StyledLabel = styled(Button)`
  padding: 0 0.35rem !important;
  pointer-events: none;
  margin: 0.15rem !important;

  span {
    font-size: 0.65rem;
  }
`;
