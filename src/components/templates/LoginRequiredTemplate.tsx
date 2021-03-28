import Container, { ContainerProps } from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { MainTemplateProps } from 'types';

import { LandingPageTemplate } from './LandingPageTemplate';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  container: {
    [breakpoints.up('md')]: {
      padding: spacing(4),
    },
  },
}));

interface Props extends Omit<MainTemplateProps, 'children'> {
  children: ContainerProps['children'];
}

export const LoginRequiredTemplate: React.FC<Props> = ({ children, ...props }) => {
  const classes = useStyles();

  return (
    <LandingPageTemplate {...props} hideLogoAndDescription>
      <Container disableGutters className={classes.container}>
        {children}
      </Container>
    </LandingPageTemplate>
  );
};
