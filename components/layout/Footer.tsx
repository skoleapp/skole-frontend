import { Box, Grid, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { TextLink } from '../shared';

export const Footer: React.FC = () => (
  <StyledFooter className="desktop-only" container>
    <Grid item xs={12} container>
      <Grid item xs={4}>
        <Box display="flex" flexDirection="column">
          <Typography variant="subtitle2" color="secondary" gutterBottom>
            COMPANY
          </Typography>
          <TextLink href="/about" color="secondary">
            About
          </TextLink>
          <TextLink href="/contact" color="secondary">
            Contact
          </TextLink>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="subtitle2" color="secondary" gutterBottom>
          SKOLE
        </Typography>
        <Box display="flex" flexDirection="column">
          <TextLink href="/courses" color="secondary">
            Courses
          </TextLink>
          <TextLink href="/schools" color="secondary">
            Schools
          </TextLink>
          <TextLink href="/subjects" color="secondary">
            Subjects
          </TextLink>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="subtitle2" color="secondary" gutterBottom>
          LEGAL
        </Typography>
        <Box display="flex" flexDirection="column">
          <TextLink href="/terms" color="secondary">
            Terms
          </TextLink>
          <TextLink href="/privacy" color="secondary">
            Privacy
          </TextLink>
        </Box>
      </Grid>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="subtitle1" color="secondary">
        © {new Date().getFullYear()} Skole Ltd.
      </Typography>
    </Grid>
  </StyledFooter>
);

const StyledFooter = styled(Grid)`
  position: absolute;
  bottom: 0;
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary);
  padding: 0.5rem;
`;
