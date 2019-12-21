import { Grid, Link as MaterialLink, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { i18n, useTranslation } from '../../i18n';
import { TextLink } from '../shared';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const handleLanguageSelect = (value: string) => () => i18n.changeLanguage(value);

  return (
    <StyledFooter className="desktop-only" container>
      <Grid item xs={12} container>
        <Grid item xs={4} container>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="secondary" gutterBottom>
              SKOLE
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextLink href="/about" color="secondary">
              {t('common:about')}
            </TextLink>
          </Grid>
          <Grid item xs={12}>
            <TextLink href="/contact" color="secondary">
              {t('common:contact')}
            </TextLink>
          </Grid>
        </Grid>
        <Grid item xs={4} container>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="secondary" gutterBottom>
              {t('common:language').toUpperCase()}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <MaterialLink onClick={handleLanguageSelect('en')} color="secondary">
              {t('common:english')}
            </MaterialLink>
          </Grid>
          <Grid item xs={12}>
            <MaterialLink onClick={handleLanguageSelect('fi')} color="secondary">
              {t('common:finnish')}
            </MaterialLink>
          </Grid>
          <Grid item xs={12}>
            <MaterialLink onClick={handleLanguageSelect('sv')} color="secondary">
              {t('common:swedish')}
            </MaterialLink>
          </Grid>
        </Grid>
        <Grid item xs={4} container>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="secondary" gutterBottom>
              {t('common:legal').toUpperCase()}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextLink href="/terms" color="secondary">
              {t('common:terms')}
            </TextLink>
          </Grid>
          <Grid item xs={12}>
            <TextLink href="/privacy" color="secondary">
              {t('common:privacy')}
            </TextLink>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" color="secondary">
          © {new Date().getFullYear()} {t('common:skoleLtd')}
        </Typography>
      </Grid>
    </StyledFooter>
  );
};

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
