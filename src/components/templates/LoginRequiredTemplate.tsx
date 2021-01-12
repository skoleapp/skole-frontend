import { Button, FormControl, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { useTranslation } from 'lib';
import Router, { useRouter } from 'next/router';
import React from 'react';
import { MainTemplateProps } from 'types';
import { urls } from 'utils';
import { ButtonLink } from '../shared';
import { FormTemplate } from './FormTemplate';

export const LoginRequiredTemplate: React.FC<MainTemplateProps> = ({ children, ...props }) => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const handleClickCancelButton = (): void => Router.back();

  const renderText = (
    <Typography variant="subtitle1" align="center">
      {t('common:loginRequired')} 🙃
    </Typography>
  );

  const renderLineBreak = <Typography component="br" />;

  const renderLoginButton = (
    <ButtonLink
      href={{ pathname: urls.login, query: { next: asPath } }}
      color="primary"
      variant="contained"
      endIcon={<ArrowForwardOutlined />}
      fullWidth
    >
      {t('common:login')}
    </ButtonLink>
  );

  const renderCancelButton = (
    <FormControl>
      <Button onClick={handleClickCancelButton} color="primary" variant="outlined" fullWidth>
        {t('common:cancel')}
      </Button>
    </FormControl>
  );

  return (
    <FormTemplate {...props}>
      {renderText}
      {renderLineBreak}
      {renderLoginButton}
      {renderCancelButton}
      {children}
    </FormTemplate>
  );
};
