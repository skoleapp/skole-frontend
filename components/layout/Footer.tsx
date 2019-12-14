import { Box, Grid, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { TextLink } from '../shared';
import { i18n } from '../../i18n';
import { Link as MaterialLink } from '@material-ui/core';

interface Props {
  t: (value: string) => any;
}

export const Footer: React.FC<Props> = ({ t }) => {
  const handleLanguageSelect = (value: string) => () => {
    i18n.changeLanguage(value);
  };

  return (
    <StyledFooter className="desktop-only" container>
      <Grid item xs={12} container>
        <Grid item xs={4}>
          <Box display="flex" flexDirection="column">
            <Typography variant="subtitle2" color="secondary" gutterBottom>
              SKOLE
            </Typography>
            <TextLink href="/about" color="secondary">
              {t('buttonAbout')}
            </TextLink>
            <TextLink href="/contact" color="secondary">
              {t('buttonContact')}
            </TextLink>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="secondary" gutterBottom>
            {t('headerLegal').toUpperCase()}
          </Typography>
          <Box display="flex" flexDirection="column">
            <TextLink href="/terms" color="secondary">
              {t('buttonTerms')}
            </TextLink>
            <TextLink href="/privacy" color="secondary">
              {t('buttonPrivacy')}
            </TextLink>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="secondary" gutterBottom>
            {t('headerLanguage').toUpperCase()}
          </Typography>
          <Box display="flex" flexDirection="column">
            <MaterialLink onClick={handleLanguageSelect('fi')} color="secondary">
              {t('fi')}
            </MaterialLink>
            <MaterialLink onClick={handleLanguageSelect('en')} color="secondary">
              {t('en')}
            </MaterialLink>
            <MaterialLink onClick={handleLanguageSelect('sv')} color="secondary">
              {t('sv')}
            </MaterialLink>
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
};

const StyledFooter = styled(Grid)`
  position: absolute;
  top: 100%;
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary);
  padding: 0.5rem;
`;
