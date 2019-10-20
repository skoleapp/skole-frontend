import React from 'react';
import styled from 'styled-components';

const StyledLogoHeader = styled.h1`
  margin: 0.5rem;
  font-family: 'Ubuntu Mono', monospace !important;
  color: var(--primary);
  font-size: 6.5rem;
  text-shadow: var(--text-shadow);
  letter-spacing: -0.25rem;
`;

export const LogoHeader: React.FC = () => <StyledLogoHeader>skole</StyledLogoHeader>;
