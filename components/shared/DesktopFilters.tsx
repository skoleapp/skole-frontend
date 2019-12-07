import { Box, CardHeader } from '@material-ui/core';
import React from 'react';
import { StyledCard } from '.';
import { SlimCardContent } from './SlimCardContent';

interface Props {
  title: string;
}

export const DesktopFilters: React.FC<Props> = ({ title, children }) => (
  <Box className="desktop-only" marginBottom="0.5rem">
    <StyledCard>
      <CardHeader title={title} />
      <SlimCardContent>{children}</SlimCardContent>
    </StyledCard>
  </Box>
);
