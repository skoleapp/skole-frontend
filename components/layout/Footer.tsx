import React, { useState } from 'react';
import styled from 'styled-components';
import { Anchor } from '../atoms';
import { Column } from '../containers';
import { Redirect } from '../utils';

const StyledFooter = styled.div`
  height: 8rem;
  background: var(--primary);
`;

const StyledColumn = styled(Column)`
  justify-content: center;
  height: 100%;
`;

export const Footer: React.FC = () => {
  const [redirect, setRedirect] = useState(false)

  if (redirect) {
    return <Redirect to="/feedback" />
  }

  return (
    <StyledFooter>
      <StyledColumn sm={8} md={6}>
        <Anchor>© {new Date().getFullYear()} Skole Ltd.</Anchor>
        <Anchor onClick={() => setRedirect(true)}>Feedback</Anchor>
      </StyledColumn>
    </StyledFooter>
  );
};
