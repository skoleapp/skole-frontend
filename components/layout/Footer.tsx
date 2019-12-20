import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { TextLink } from '../shared';

export const Footer: React.FC = () => (
  <StyledFooter className="desktop-only" container>
    <Grid item xs={12} container>
      <Grid item xs={4} container>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="secondary" gutterBottom>
            COMPANY
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextLink href="/about" color="secondary">
            About
          </TextLink>
        </Grid>
        <Grid item xs={12}>
          <TextLink href="/contact" color="secondary">
            Contact
          </TextLink>
        </Grid>
      </Grid>
      <Grid item xs={4} container>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="secondary" gutterBottom>
            SKOLE
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextLink href="/courses" color="secondary">
            Courses
          </TextLink>
        </Grid>
        <Grid item xs={12}>
          <TextLink href="/schools" color="secondary">
            Schools
          </TextLink>
        </Grid>
        <Grid item xs={12}>
          <TextLink href="/subjects" color="secondary">
            Subjects
          </TextLink>
        </Grid>
      </Grid>
      <Grid item xs={4} container>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="secondary" gutterBottom>
            LEGAL
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextLink href="/terms" color="secondary">
            Terms
          </TextLink>
        </Grid>
        <Grid item xs={12}>
          <TextLink href="/privacy" color="secondary">
            Privacy
          </TextLink>
        </Grid>
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
  bottom: -10rem;
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary);
  padding: 0.5rem;
`;
